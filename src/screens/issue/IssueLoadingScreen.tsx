import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { Screen, Dialog } from '@/components/common';
import { colors, spacing, typography } from '@/theme';
import { CagHttpService } from '@/data/services/httpService';
import { useWalletStore } from '@/data/store/walletStore';

type Nav = NativeStackNavigationProp<RootStackParamList, 'IssueLoading'>;
type Rt = RouteProp<RootStackParamList, 'IssueLoading'>;

const STEPS = ['본인확인 정보 검증', '발급기관 인증', 'VC 발급 요청', '신분증 저장'];

export default function IssueLoadingScreen() {
  const navigation = useNavigation<Nav>();
  const { vcType } = useRoute<Rt>().params;
  const addId = useWalletStore((s) => s.addId);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const stepTimer = setInterval(() => {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }, 500);

    (async () => {
      const r = await CagHttpService.issueVc(vcType);
      clearInterval(stepTimer);
      if (cancelled) return;
      if (r.data) {
        await addId(r.data);
        navigation.replace('IssueComplete', { vcId: r.data.vcId });
      } else {
        setError(r.resultMessage);
      }
    })();

    return () => {
      cancelled = true;
      clearInterval(stepTimer);
    };
  }, []);

  return (
    <Screen>
      <View style={styles.body}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.title}>신분증을 발급하고 있습니다</Text>
        <View style={styles.steps}>
          {STEPS.map((s, i) => (
            <View key={s} style={styles.stepRow}>
              <Text style={[styles.stepMark, i <= step && styles.stepMarkDone]}>
                {i < step ? '✓' : i === step ? '●' : '○'}
              </Text>
              <Text style={[styles.stepText, i <= step && styles.stepTextActive]}>{s}</Text>
            </View>
          ))}
        </View>
      </View>

      <Dialog
        visible={!!error}
        title="발급 실패"
        message={error ?? ''}
        onConfirm={() => navigation.goBack()}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.xl, padding: spacing.xl },
  title: { ...typography.h3 },
  steps: { alignSelf: 'stretch', gap: spacing.md, marginTop: spacing.lg },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  stepMark: { fontSize: 16, color: colors.textTertiary, width: 20, textAlign: 'center' },
  stepMarkDone: { color: colors.primary },
  stepText: { ...typography.body, color: colors.textTertiary },
  stepTextActive: { color: colors.text, fontWeight: '600' },
});
