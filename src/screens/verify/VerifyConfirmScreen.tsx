import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { Button, Header, Screen } from '@/components/common';
import { colors, radius, spacing, typography } from '@/theme';
import { useWalletStore } from '@/data/store/walletStore';
import { VpvService } from '@/data/services/vpvService';
import { VerifiablePresentation } from '@/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'VerifyConfirm'>;
type Rt = RouteProp<RootStackParamList, 'VerifyConfirm'>;

export default function VerifyConfirmScreen() {
  const navigation = useNavigation<Nav>();
  const { profile, vcId } = useRoute<Rt>().params;
  const id = useWalletStore((s) => s.getId(vcId));
  const addHistory = useWalletStore((s) => s.addHistory);
  const [submitting, setSubmitting] = useState(false);

  const [selected, setSelected] = useState<Record<string, boolean>>(
    Object.fromEntries(profile.requestedClaims.map((c) => [c.key, c.required])),
  );

  const toggle = (key: string, required: boolean) => {
    if (required) return;
    setSelected((s) => ({ ...s, [key]: !s[key] }));
  };

  const submit = async () => {
    if (!id) return;
    setSubmitting(true);
    const a = id as any;

    // 승인된 항목 → 지갑(mock)의 실제 유저 정보 값으로 채운다
    const valueFor = (key: string): string => {
      switch (key) {
        case 'name':
          return a.name ?? '';
        case 'birthday':
          return a.birthday ?? a.birth ?? '';
        case 'address':
          return a.address ?? '';
        case 'rrn':
          return a.ihidNum ?? '';
        case 'adult':
          return '만 19세 이상';
        default:
          return String(a[key] ?? '제공');
      }
    };

    const disclosedClaims: Record<string, string> = {};
    const disclosed: { label: string; value: string }[] = [];
    let sharePhoto = false;
    for (const c of profile.requestedClaims) {
      if (!selected[c.key]) continue;
      if (c.key === 'photo') {
        sharePhoto = true;
        disclosedClaims['photo'] = '제공';
        continue;
      }
      const v = valueFor(c.key);
      disclosedClaims[c.key] = v;
      if (c.key !== 'name') disclosed.push({ label: c.label, value: v || '-' });
    }

    const vp: VerifiablePresentation = {
      trxCode: profile.trxCode,
      vcId: id.vcId,
      vcType: id.vcType,
      disclosedClaims,
      createdAt: new Date().toISOString(),
    };
    const result = await VpvService.submitPresentation(vp, profile.verifier);
    const privacy = profile.requestedClaims
      .filter((c) => selected[c.key])
      .map((c) => c.label)
      .join(', ');
    await addHistory(profile.verifier, privacy);
    setSubmitting(false);
    if (result.success) {
      navigation.replace('VerifyComplete', {
        verifier: profile.verifier,
        purpose: profile.purpose,
        name: a.name ?? '',
        photo: sharePhoto,
        disclosed,
      });
    }
  };

  return (
    <Screen>
      <Header title="정보 제공 동의" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.verifierCard}>
          <Text style={styles.verifierName}>{profile.verifier}</Text>
          <Text style={styles.purpose}>{profile.purpose}</Text>
        </View>

        <Text style={styles.sectionTitle}>요청 정보</Text>
        <Text style={styles.sectionDesc}>아래 정보가 검증 기관에 제공됩니다.</Text>

        <View style={styles.card}>
          {profile.requestedClaims.map((c) => (
            <Pressable
              key={c.key}
              style={styles.claimRow}
              onPress={() => toggle(c.key, c.required)}
            >
              <View style={styles.claimInfo}>
                <Text style={styles.claimLabel}>{c.label}</Text>
                <Text style={styles.claimTag}>{c.required ? '필수' : '선택'}</Text>
              </View>
              <View style={[styles.check, selected[c.key] && styles.checkOn]}>
                {selected[c.key] && <Text style={styles.checkMark}>✓</Text>}
              </View>
            </Pressable>
          ))}
        </View>

        <Text style={styles.warn}>
          ⚠️ 제공한 정보는 검증 기관의 정책에 따라 이용·보관될 수 있습니다.
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="동의하고 제공" loading={submitting} onPress={submit} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg },
  verifierCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  verifierName: { ...typography.h3, color: colors.textInverse },
  purpose: { ...typography.body, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  sectionTitle: { ...typography.title, marginBottom: 4 },
  sectionDesc: { ...typography.bodySecondary, marginBottom: spacing.md },
  card: { backgroundColor: colors.surface, borderRadius: radius.md, overflow: 'hidden' },
  claimRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  claimInfo: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  claimLabel: { ...typography.body },
  claimTag: { ...typography.caption, color: colors.primary },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkMark: { color: colors.textInverse, fontWeight: '700', fontSize: 13 },
  warn: { ...typography.caption, marginTop: spacing.lg, lineHeight: 18 },
  footer: { padding: spacing.lg },
});
