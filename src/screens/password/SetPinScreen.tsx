import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { Header, PinPad, PinDots, Screen, Dialog } from '@/components/common';
import { colors, spacing, typography } from '@/theme';
import { useAuthStore } from '@/data/store/authStore';

type Nav = NativeStackNavigationProp<RootStackParamList, 'SetPin'>;
type Rt = RouteProp<RootStackParamList, 'SetPin'>;

const PIN_LEN = 6;

export default function SetPinScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const mode = route.params?.mode ?? 'create';
  const setPin = useAuthStore((s) => s.setPin);

  const [step, setStep] = useState<'first' | 'confirm'>('first');
  const [first, setFirst] = useState('');
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onChange = (next: string) => {
    setValue(next);
    if (next.length === PIN_LEN) {
      setTimeout(() => handleComplete(next), 120);
    }
  };

  const handleComplete = async (pin: string) => {
    if (step === 'first') {
      setFirst(pin);
      setValue('');
      setStep('confirm');
    } else {
      if (pin === first) {
        await setPin(pin);
        if (mode === 'create') {
          navigation.replace('BiometricSetup');
        } else {
          navigation.goBack();
        }
      } else {
        setError('비밀번호가 일치하지 않습니다.\n다시 설정해 주세요.');
        setValue('');
        setFirst('');
        setStep('first');
      }
    }
  };

  return (
    <Screen>
      <Header title={mode === 'change' ? '비밀번호 변경' : '비밀번호 설정'} onBack={() => navigation.goBack()} />
      <View style={styles.body}>
        <Text style={styles.title}>
          {step === 'first' ? '사용할 비밀번호 6자리를\n입력해 주세요.' : '비밀번호를 한 번 더\n입력해 주세요.'}
        </Text>
        <PinDots length={PIN_LEN} filled={value.length} />
      </View>
      <View style={styles.pad}>
        <PinPad value={value} maxLength={PIN_LEN} onChange={onChange} />
      </View>

      <Dialog visible={!!error} title="알림" message={error ?? ''} onConfirm={() => setError(null)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.xxl },
  title: { ...typography.h3, textAlign: 'center' },
  pad: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
});
