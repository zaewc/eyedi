import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '@/navigation/types';
import { Button } from '@/components/common';
import { colors, fonts, radius, spacing } from '@/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'VerifyComplete'>;
type Rt = RouteProp<RootStackParamList, 'VerifyComplete'>;

const samplePhoto = require('../../../assets/img/sample_img.jpg');

function nowStr(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

export default function VerifyCompleteScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { verifier, purpose, name, photo, disclosed } = useRoute<Rt>().params;

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={[styles.body, { paddingTop: insets.top + spacing.xl }]}>
        <View style={styles.checkCircle}>
          <Text style={styles.checkMark}>✓</Text>
        </View>
        <Text style={styles.title}>신원 확인 완료</Text>
        <Text style={styles.sub}>진위확인된 신원정보가 제공되었습니다.</Text>

        <View style={styles.card}>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>진위확인됨</Text>
            </View>
          </View>

          {photo && (
            <View style={styles.photoWrap}>
              <Image source={samplePhoto} style={styles.photo} resizeMode="cover" />
            </View>
          )}

          <Text style={styles.name}>{name}</Text>

          <View style={styles.rows}>
            {disclosed.map((d) => (
              <View key={d.label} style={styles.row}>
                <Text style={styles.label}>{d.label}</Text>
                <Text style={styles.value}>{d.value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.metaCard}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>검증 기관</Text>
            <Text style={styles.metaValue}>{verifier}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>이용 목적</Text>
            <Text style={styles.metaValue}>{purpose}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>제공 일시</Text>
            <Text style={styles.metaValue}>{nowStr()}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <Button title="확인" onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Main' }] })} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  body: { padding: spacing.lg, alignItems: 'center', paddingBottom: spacing.xl },
  checkCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  checkMark: { color: '#fff', fontSize: 40, lineHeight: 44, fontFamily: fonts.bold },
  title: { fontFamily: fonts.bold, fontSize: 22, color: colors.text },
  sub: { fontFamily: fonts.regular, fontSize: 14, color: colors.textSecondary, marginTop: 6, marginBottom: spacing.lg },
  card: {
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    shadowColor: '#0B2C63',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  badgeRow: { alignSelf: 'stretch', alignItems: 'flex-end' },
  badge: { backgroundColor: '#E7F6EE', paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill },
  badgeText: { fontFamily: fonts.semibold, fontSize: 12, color: colors.success },
  photoWrap: { marginTop: spacing.sm },
  photo: { width: 96, height: 122, borderRadius: 6, borderWidth: 1, borderColor: colors.border },
  name: { fontFamily: fonts.bold, fontSize: 22, color: colors.text, marginTop: spacing.md },
  rows: { alignSelf: 'stretch', marginTop: spacing.md },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  label: { fontFamily: fonts.regular, fontSize: 14, color: colors.textSecondary },
  value: { fontFamily: fonts.semibold, fontSize: 14, color: colors.text, flex: 1, textAlign: 'right', marginLeft: spacing.md },
  metaCard: {
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.md,
  },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  metaLabel: { fontFamily: fonts.regular, fontSize: 13, color: colors.textTertiary },
  metaValue: { fontFamily: fonts.semibold, fontSize: 13, color: colors.text, flex: 1, textAlign: 'right', marginLeft: spacing.md },
  footer: { padding: spacing.lg, backgroundColor: colors.surface },
});
