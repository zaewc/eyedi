import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { Button, Screen } from '@/components/common';
import { colors, spacing, typography } from '@/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

const { width } = Dimensions.get('window');

const PAGES = [
  {
    icon: '🪪',
    title: '지갑 속 신분증을\n스마트폰 하나로',
    desc: '운전면허증, 주민등록증 등\n다양한 신분증을 모바일로 발급받으세요.',
  },
  {
    icon: '🔒',
    title: '안전하게\n내 정보를 관리',
    desc: '필요한 정보만 선택해서 제시할 수 있어\n개인정보를 안전하게 보호합니다.',
  },
  {
    icon: '📷',
    title: 'QR·NFC로\n간편하게 제시',
    desc: 'QR 코드 스캔 한 번으로\n어디서나 신분을 증명하세요.',
  },
];

export default function OnboardingScreen() {
  const navigation = useNavigation<Nav>();
  const [page, setPage] = useState(0);

  return (
    <Screen>
      <FlatList
        data={PAGES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        onMomentumScrollEnd={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / width))}
        renderItem={({ item }) => (
          <View style={[styles.page, { width }]}>
            <Text style={styles.icon}>{item.icon}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc}>{item.desc}</Text>
          </View>
        )}
      />
      <View style={styles.dots}>
        {PAGES.map((_, i) => (
          <View key={i} style={[styles.dot, i === page && styles.dotActive]} />
        ))}
      </View>
      <View style={styles.footer}>
        <Button title="시작하기" onPress={() => navigation.navigate('Terms')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
  icon: { fontSize: 72, marginBottom: spacing.xl },
  title: { ...typography.h1, textAlign: 'center', marginBottom: spacing.md },
  desc: { ...typography.bodySecondary, textAlign: 'center' },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: spacing.lg },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  dotActive: { backgroundColor: colors.primary, width: 20 },
  footer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
});
