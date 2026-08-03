import React from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { Header, Screen } from '@/components/common';
import { colors, radius, spacing, typography } from '@/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'ServiceCenter'>;

export default function ServiceCenterScreen() {
  const navigation = useNavigation<Nav>();

  const faqs = [
    { q: '모바일 신분증은 어떻게 발급받나요?', a: '발급 탭에서 원하는 신분증을 선택하고 본인확인 후 발급받을 수 있습니다.' },
    { q: '기기를 변경하면 어떻게 하나요?', a: '기존 기기의 신분증을 해지한 뒤 새 기기에서 다시 발급받아야 합니다.' },
    { q: '신분증을 분실하면 어떻게 하나요?', a: '전체 메뉴 > 분실 신고에서 즉시 사용 정지할 수 있습니다.' },
  ];

  return (
    <Screen background={colors.surface}>
      <Header title="고객센터" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>고객센터 전화</Text>
          <Pressable onPress={() => Linking.openURL('tel:1533-1436')}>
            <Text style={styles.phone}>☎  1533-1436</Text>
          </Pressable>
          <Text style={styles.hours}>평일 09:00 ~ 18:00 (주말·공휴일 휴무)</Text>
        </View>

        <Text style={styles.sectionTitle}>자주 묻는 질문</Text>
        {faqs.map((f) => (
          <View key={f.q} style={styles.faqCard}>
            <Text style={styles.q}>Q. {f.q}</Text>
            <Text style={styles.a}>{f.a}</Text>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg, gap: spacing.md },
  contactCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.lg,
    alignItems: 'center',
  },
  contactTitle: { ...typography.label, color: 'rgba(255,255,255,0.85)' },
  phone: { ...typography.h1, color: colors.textInverse, marginVertical: spacing.sm },
  hours: { ...typography.caption, color: 'rgba(255,255,255,0.8)' },
  sectionTitle: { ...typography.title, marginTop: spacing.md },
  faqCard: { backgroundColor: colors.background, borderRadius: radius.md, padding: spacing.md },
  q: { ...typography.title, marginBottom: 6 },
  a: { ...typography.bodySecondary },
});
