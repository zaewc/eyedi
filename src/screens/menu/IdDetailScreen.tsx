import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { Button, Header, Screen } from '@/components/common';
import IdCard from '@/components/IdCard';
import { colors, radius, spacing, typography } from '@/theme';
import { useWalletStore } from '@/data/store/walletStore';
import { MobileId } from '@/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'IdDetail'>;
type Rt = RouteProp<RootStackParamList, 'IdDetail'>;

export default function IdDetailScreen() {
  const navigation = useNavigation<Nav>();
  const { vcId } = useRoute<Rt>().params;
  const id = useWalletStore((s) => s.getId(vcId));
  const [masked, setMasked] = useState(true);

  if (!id) {
    return (
      <Screen>
        <Header title="신분증" onBack={() => navigation.goBack()} />
        <View style={styles.empty}>
          <Text style={typography.body}>신분증 정보를 찾을 수 없습니다.</Text>
        </View>
      </Screen>
    );
  }

  const rows = detailRows(id, masked);

  return (
    <Screen background={colors.surface}>
      <Header title="신분증 상세" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.body}>
        <IdCard id={id} />

        <Pressable style={styles.maskToggle} onPress={() => setMasked((m) => !m)}>
          <Text style={styles.maskText}>{masked ? '👁️  전체 정보 보기' : '🙈  정보 가리기'}</Text>
        </Pressable>

        <View style={styles.card}>
          {rows.map((r) => (
            <View key={r.label} style={styles.row}>
              <Text style={styles.rowLabel}>{r.label}</Text>
              <Text style={styles.rowValue}>{r.value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="QR로 제시하기"
          onPress={() => navigation.navigate('PresentQR', { vcId: id.vcId })}
        />
      </View>
    </Screen>
  );
}

function mask(value: string | undefined): string {
  if (!value) return '-';
  if (value.length <= 2) return value;
  return value.slice(0, 1) + '*'.repeat(Math.max(1, value.length - 2)) + value.slice(-1);
}

function detailRows(id: MobileId, masked: boolean): { label: string; value: string }[] {
  const anyId = id as any;
  const base: { label: string; value: string }[] = [
    { label: '성명', value: anyId.name ?? '-' },
    { label: '생년월일', value: masked ? mask(anyId.birthday ?? anyId.birth) : anyId.birthday ?? anyId.birth ?? '-' },
    { label: '주소', value: masked ? mask(anyId.address) : anyId.address ?? '-' },
  ];
  if (id.vcType === 'mdriverlic') {
    base.push(
      { label: '면허번호', value: masked ? mask(anyId.dlNo) : anyId.dlNo },
      { label: '종별', value: anyId.asort ?? '-' },
      { label: '적성검사기간', value: `${anyId.aptdInspectBegin ?? ''} ~ ${anyId.aptdInspectEnd ?? ''}` },
    );
  }
  base.push(
    { label: '발급일', value: id.vcIssuanceDate },
    { label: '유효기간', value: id.vcExpirationDate },
    { label: '상태', value: id.idStatus },
  );
  return base;
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg, gap: spacing.md },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  maskToggle: { alignSelf: 'center', padding: spacing.sm },
  maskText: { ...typography.label, color: colors.primary },
  card: { backgroundColor: colors.background, borderRadius: radius.md, padding: spacing.md },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  rowLabel: { ...typography.bodySecondary },
  rowValue: { ...typography.body, flex: 1, textAlign: 'right', marginLeft: spacing.md },
  footer: { padding: spacing.lg },
});
