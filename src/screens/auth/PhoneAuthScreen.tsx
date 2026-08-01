import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { Button, Header, Screen, Dialog } from '@/components/common';
import { colors, radius, spacing, typography } from '@/theme';
import { AppHttpService } from '@/data/services/httpService';

type Nav = NativeStackNavigationProp<RootStackParamList, 'PhoneAuth'>;

export default function PhoneAuthScreen() {
  const navigation = useNavigation<Nav>();
  const [name, setName] = useState('');
  const [rrnFront, setRrnFront] = useState('');
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);
  const [authTxId, setAuthTxId] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSend = name.length > 0 && rrnFront.length === 6 && phone.length >= 10;

  const send = async () => {
    setLoading(true);
    const r = await AppHttpService.sendAuthNumber(phone);
    setLoading(false);
    if (r.data) {
      setAuthTxId(r.data.authTxId);
      setSent(true);
    }
  };

  const verify = async () => {
    setLoading(true);
    const r = await AppHttpService.verifyAuthNumber(authTxId, code);
    setLoading(false);
    if (r.data) {
      navigation.navigate('SetPin', { mode: 'create' });
    } else {
      setError(r.resultMessage);
    }
  };

  return (
    <Screen>
      <Header title="본인확인" onBack={() => navigation.goBack()} />
      <View style={styles.body}>
        <Text style={styles.heading}>본인 명의의 휴대폰으로{'\n'}본인확인을 진행합니다.</Text>

        <Field label="이름">
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="홍길동" />
        </Field>
        <Field label="생년월일 (6자리)">
          <TextInput
            style={styles.input}
            value={rrnFront}
            onChangeText={setRrnFront}
            keyboardType="number-pad"
            maxLength={6}
            placeholder="900101"
          />
        </Field>
        <Field label="휴대폰 번호">
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="01012345678"
          />
        </Field>

        {sent && (
          <Field label="인증번호 (데모: 000000)">
            <TextInput
              style={styles.input}
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={6}
              placeholder="6자리"
            />
          </Field>
        )}
      </View>

      <View style={styles.footer}>
        {!sent ? (
          <Button title="인증번호 요청" disabled={!canSend} loading={loading} onPress={send} />
        ) : (
          <Button title="확인" disabled={code.length !== 6} loading={loading} onPress={verify} />
        )}
      </View>

      <Dialog
        visible={!!error}
        title="본인확인 실패"
        message={error ?? ''}
        onConfirm={() => setError(null)}
      />
    </Screen>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg },
  heading: { ...typography.h2, marginBottom: spacing.xl },
  field: { marginBottom: spacing.md },
  label: { ...typography.label, marginBottom: spacing.xs },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: colors.text,
  },
  footer: { padding: spacing.lg, marginTop: 'auto' },
});
