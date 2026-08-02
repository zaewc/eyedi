import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '@/navigation/types';
import { PinPad, PinDots } from '@/components/common';
import { colors, spacing, typography } from '@/theme';
import { useAuthStore } from '@/data/store/authStore';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Lock'>;

const PIN_LEN = 6;
const MAX_TRIES = 5;

export default function LockScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const verifyPin = useAuthStore((s) => s.verifyPin);
  const unlock = useAuthStore((s) => s.unlock);
  const biometricEnabled = useAuthStore((s) => s.biometricEnabled);

  const [value, setValue] = useState('');
  const [tries, setTries] = useState(0);
  const [shake, setShake] = useState(false);

  const enter = () => {
    unlock();
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
  };

  const tryBiometric = async () => {
    if (!biometricEnabled) return;
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!enrolled) return;
    const res = await LocalAuthentication.authenticateAsync({
      promptMessage: '생체 인증으로 잠금 해제',
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
        setShake(true);
        setTries((t) => t + 1);
        setTimeout(() => {
          setValue('');
          setShake(false);
        }, 400);
      }
    }
  };

  const remaining = MAX_TRIES - tries;

  return (
    <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.root}>
      <View style={[styles.top, { paddingTop: insets.top + 40 }]}>
        <Text style={styles.title}>비밀번호 입력</Text>
        <Text style={styles.subtitle}>모바일 신분증 비밀번호 6자리</Text>
        <View style={[styles.dots, shake && styles.shake]}>
          <PinDots length={PIN_LEN} filled={value.length} light />
        </View>
        {tries > 0 && (
          <Text style={styles.error}>비밀번호가 일치하지 않습니다. (남은 횟수 {remaining}회)</Text>
        )}
      </View>

      <View style={[styles.pad, { paddingBottom: insets.bottom + spacing.md }]}>
        {biometricEnabled && (
          <Pressable style={styles.bioBtn} onPress={tryBiometric}>
            <Text style={styles.bioText}>👆 생체 인증으로 로그인</Text>
          </Pressable>
        )}
        <PinPadLight value={value} onChange={onChange} />
      </View>
    </LinearGradient>
  );
}

function PinPadLight({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <View style={styles.lightPad}>
      <PinPad value={value} maxLength={PIN_LEN} onChange={onChange} shuffle light />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'space-between' },
  top: { alignItems: 'center' },
  title: { ...typography.h2, color: colors.textInverse },
  subtitle: { ...typography.bodySecondary, color: 'rgba(255,255,255,0.8)', marginTop: 8 },
  dots: { marginTop: spacing.xxl },
  shake: { transform: [{ translateX: 6 }] },
  error: { color: '#FFD5D5', marginTop: spacing.lg, fontSize: 13 },
  pad: { paddingHorizontal: spacing.lg },
  bioBtn: { alignSelf: 'center', padding: spacing.md, marginBottom: spacing.sm },
  bioText: { color: colors.textInverse, fontSize: 15, fontWeight: '600' },
  lightPad: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 20,
    padding: spacing.md,
  },
});
