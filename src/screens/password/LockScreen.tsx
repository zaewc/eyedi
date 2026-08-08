import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '@/navigation/types';
import { PinPad, PinDots } from '@/components/common';
import { fonts, spacing } from '@/theme';
import { useAuthStore } from '@/data/store/authStore';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Lock'>;

const PIN_LEN = 6;
const MAX_TRIES = 5;
const BG = '#EBF5FF'; // v1 @color/bg_password
const RED = '#EB003B'; // v1 @color/red_eb

export default function LockScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const verifyPin = useAuthStore((s) => s.verifyPin);
  const unlock = useAuthStore((s) => s.unlock);
  const biometricEnabled = useAuthStore((s) => s.biometricEnabled);

  const [value, setValue] = useState('');
  const [tries, setTries] = useState(0);

  const enter = () => {
    unlock();
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
  };

  const tryBiometric = async () => {
    if (!biometricEnabled) return;
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!enrolled) return;
    const res = await LocalAuthentication.authenticateAsync({
      promptMessage: '생체 인증으로 로그인',
      cancelLabel: '비밀번호 입력',
    });
    if (res.success) enter();
  };

  useEffect(() => {
    tryBiometric();
  }, []);

  const onChange = async (next: string) => {
    setValue(next);
    if (next.length === PIN_LEN) {
      const ok = await verifyPin(next);
      if (ok) {
        enter();
      } else {
        setTries((t) => t + 1);
        setTimeout(() => setValue(''), 350);
      }
    }
  };

  const remaining = MAX_TRIES - tries;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.top}>
        <Text style={styles.title}>모바일 신분증 앱 비밀번호{'\n'}6자리를 입력하세요.</Text>

        <View style={styles.dots}>
          <PinDots length={PIN_LEN} filled={value.length} />
        </View>

        {tries > 0 ? (
          <Text style={styles.error}>비밀번호를 잘못 입력하셨습니다.{'\n'}다시 입력해 주세요. (남은 횟수: {remaining})</Text>
        ) : (
          <Text style={styles.warn}>비밀번호를 5회 잘못 입력하면{'\n'}모바일 신분증이 앱에서 삭제됩니다.</Text>
        )}
      </View>

      <View style={[styles.pad, { paddingBottom: insets.bottom + spacing.md }]}>
        {biometricEnabled && (
          <Pressable style={styles.bioBtn} onPress={tryBiometric}>
            <Text style={styles.bioText}>생체 인증 로그인</Text>
          </Pressable>
        )}
        <PinPad value={value} maxLength={PIN_LEN} onChange={onChange} shuffle />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG, justifyContent: 'space-between' },
  top: { alignItems: 'center', paddingTop: spacing.xxl },
  title: { fontFamily: fonts.bold, fontSize: 20, color: '#111111', textAlign: 'center', lineHeight: 30 },
  dots: { marginTop: spacing.xxl },
  warn: { fontFamily: fonts.regular, fontSize: 13, color: '#7A8390', textAlign: 'center', marginTop: spacing.xl, lineHeight: 19 },
  error: { fontFamily: fonts.semibold, fontSize: 13, color: RED, textAlign: 'center', marginTop: spacing.xl, lineHeight: 19 },
  pad: { paddingHorizontal: spacing.lg },
  bioBtn: { alignSelf: 'center', padding: spacing.md, marginBottom: spacing.sm },
  bioText: { fontFamily: fonts.semibold, fontSize: 15, color: '#246beb' },
});
