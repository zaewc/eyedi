import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { Button, Screen } from '@/components/common';
import { colors, spacing, typography } from '@/theme';
import { useAuthStore } from '@/data/store/authStore';

type Nav = NativeStackNavigationProp<RootStackParamList, 'BiometricSetup'>;

export default function BiometricSetupScreen() {
  const navigation = useNavigation<Nav>();
  const setBiometric = useAuthStore((s) => s.setBiometric);
  const setOnboarded = useAuthStore((s) => s.setOnboarded);
  const [loading, setLoading] = useState(false);

  const finish = () => {
    setOnboarded();
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
  };

  const enable = async () => {
    setLoading(true);
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (hasHardware && enrolled) {
        const res = await LocalAuthentication.authenticateAsync({
          promptMessage: '생체 인증을 등록합니다',
          cancelLabel: '취소',
        });
        if (res.success) await setBiometric(true);
      } else {

        await setBiometric(true);
      }
    } finally {
      setLoading(false);
      finish();
    }
  };

  return (
    <Screen>
      <View style={styles.body}>
        <Text style={styles.icon}>👆</Text>
        <Text style={styles.title}>생체 인증을 사용하시겠어요?</Text>
        <Text style={styles.desc}>
          지문 또는 얼굴 인증으로{'\n'}더 빠르고 안전하게 로그인할 수 있습니다.
        </Text>
      </View>
      <View style={styles.footer}>
        <Button title="생체 인증 사용" loading={loading} onPress={enable} />
        <Button title="다음에 하기" variant="ghost" onPress={finish} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
  icon: { fontSize: 80, marginBottom: spacing.xl },
  title: { ...typography.h2, textAlign: 'center', marginBottom: spacing.md },
  desc: { ...typography.bodySecondary, textAlign: 'center' },
  footer: { padding: spacing.lg, gap: spacing.sm },
});
