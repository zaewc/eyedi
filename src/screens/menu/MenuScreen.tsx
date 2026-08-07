import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { Header } from '@/components/common';
import { colors, radius, spacing, typography } from '@/theme';
import { WEB_URLS } from '@/data/services/endpoints';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function MenuScreen() {
  const navigation = useNavigation<Nav>();

  const sections: { title: string; items: { label: string; onPress: () => void }[] }[] = [
    {
      title: '이용',
      items: [
        { label: '이용 내역', onPress: () => navigation.navigate('UsageHistory') },
        { label: '공지사항', onPress: () => navigation.navigate('Notice') },
        {
          label: '이용 안내',
          onPress: () => navigation.navigate('Web', { url: WEB_URLS.useGuidance, title: '이용 안내' }),
        },
      ],
    },
    {
      title: '신분증 관리',
      items: [
        { label: '분실 신고', onPress: () => navigation.navigate('LossReport') },
        { label: '고객센터', onPress: () => navigation.navigate('ServiceCenter') },
      ],
    },
    {
      title: '설정',
      items: [
        { label: '환경설정', onPress: () => navigation.navigate('Settings') },
        {
          label: '오픈소스 라이선스',
          onPress: () => navigation.navigate('Web', { url: WEB_URLS.license, title: '오픈소스 라이선스' }),
        },
      ],
    },
  ];

  return (
    <View style={styles.root}>
      <Header title="전체 메뉴" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.body}>
        {sections.map((s) => (
          <View key={s.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{s.title}</Text>
            <View style={styles.card}>
              {s.items.map((item, idx) => (
                <Pressable
                  key={item.label}
                  style={[styles.row, idx < s.items.length - 1 && styles.rowBorder]}
                  onPress={item.onPress}
                >
                  <Text style={styles.rowLabel}>{item.label}</Text>
                  <Text style={styles.chevron}>›</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ))}
        <Text style={styles.version}>모바일 신분증 v5.5.0 (382)</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  topBar: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm, backgroundColor: colors.background },
  brand: { ...typography.h3, color: colors.primary },
  body: { padding: spacing.lg, gap: spacing.lg },
  section: { gap: spacing.sm },
  sectionTitle: { ...typography.label, marginLeft: spacing.xs },
  card: { backgroundColor: colors.background, borderRadius: radius.md, overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  rowLabel: { ...typography.body },
  chevron: { fontSize: 22, color: colors.textTertiary },
  version: { ...typography.caption, textAlign: 'center', marginTop: spacing.lg },
});
