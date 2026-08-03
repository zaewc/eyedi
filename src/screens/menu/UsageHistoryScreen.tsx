import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { Header, Screen } from '@/components/common';
import { colors, radius, spacing, typography } from '@/theme';
import { useWalletStore } from '@/data/store/walletStore';

type Nav = NativeStackNavigationProp<RootStackParamList, 'UsageHistory'>;

export default function UsageHistoryScreen() {
  const navigation = useNavigation<Nav>();
  const history = useWalletStore((s) => s.history);

  return (
    <Screen background={colors.surface}>
      <Header title="이용 내역" onBack={() => navigation.goBack()} />
      <FlatList
        data={history}
        keyExtractor={(item) => String(item.no)}
        contentContainerStyle={styles.body}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={typography.bodySecondary}>이용 내역이 없습니다.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.rowTop}>
              <Text style={styles.verifier}>{item.verifier}</Text>
              <Text style={styles.date}>{item.verifyDate}</Text>
            </View>
            <Text style={styles.privacy}>제공 정보: {item.privacy}</Text>
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg, gap: spacing.sm },
  empty: { alignItems: 'center', paddingTop: 80 },
  card: { backgroundColor: colors.background, borderRadius: radius.md, padding: spacing.md },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  verifier: { ...typography.title, flex: 1 },
  date: { ...typography.caption },
  privacy: { ...typography.bodySecondary, marginTop: 6 },
});
