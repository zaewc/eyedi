import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { Header } from '@/components/common';
import { colors, radius, spacing, typography } from '@/theme';
import { CagHttpService } from '@/data/services/httpService';
import { IssuableVc } from '@/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function ApplyScreen() {
  const navigation = useNavigation<Nav>();
  const [list, setList] = useState<IssuableVc[]>([]);

  useEffect(() => {
    CagHttpService.getIssuableList().then((r) => setList(r.data ?? []));
  }, []);

  return (
    <View style={styles.root}>
      <Header title="신분증 발급" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.heading}>발급 가능한 신분증</Text>
        {list.map((item) => (
          <Pressable
            key={item.vcType}
            disabled={!item.available}
            style={[styles.item, !item.available && styles.itemDisabled]}
            onPress={() => navigation.navigate('IssueConfirm', { vcType: item.vcType })}
          >
            <View style={styles.itemIcon}>
              <Text style={styles.itemEmoji}>{iconFor(item.vcType)}</Text>
            </View>
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDesc}>{item.description}</Text>
            </View>
            {item.available ? (
              <Text style={styles.chevron}>›</Text>
            ) : (
              <Text style={styles.soon}>준비중</Text>
            )}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

function iconFor(vcType: string): string {
  switch (vcType) {
    case 'mdriverlic':
      return '🚗';
    case 'identitycard':
      return '🪪';
    case 'ntqc':
      return '📜';
    case 'nationmerit':
      return '🎖️';
    default:
      return '🗂️';
  }
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  topBar: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  brand: { ...typography.h3, color: colors.primary },
  body: { padding: spacing.lg, gap: spacing.sm },
  heading: { ...typography.h2, marginBottom: spacing.md },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  itemDisabled: { opacity: 0.5 },
  itemIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemEmoji: { fontSize: 24 },
  itemInfo: { flex: 1, marginLeft: spacing.md },
  itemTitle: { ...typography.title },
  itemDesc: { ...typography.caption, marginTop: 2 },
  chevron: { fontSize: 24, color: colors.textTertiary },
  soon: { ...typography.caption, color: colors.textTertiary },
});
