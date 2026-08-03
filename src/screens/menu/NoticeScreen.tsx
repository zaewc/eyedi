import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { Header, Screen } from '@/components/common';
import { colors, radius, spacing, typography } from '@/theme';
import { mockNotices } from '@/data/mock/mockData';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Notice'>;

export default function NoticeScreen() {
  const navigation = useNavigation<Nav>();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <Screen background={colors.surface}>
      <Header title="공지사항" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.body}>
        {mockNotices.map((n) => {
          const open = openId === n.id;
          return (
            <Pressable
              key={n.id}
              style={styles.card}
              onPress={() => setOpenId(open ? null : n.id)}
            >
              <View style={styles.rowTop}>
                <Text style={styles.title} numberOfLines={open ? undefined : 1}>
                  {n.title}
                </Text>
                <Text style={styles.chevron}>{open ? '▲' : '▼'}</Text>
              </View>
              <Text style={styles.date}>{n.date}</Text>
              {open && <Text style={styles.content}>{n.body}</Text>}
            </Pressable>
          );
        })}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg, gap: spacing.sm },
  card: { backgroundColor: colors.background, borderRadius: radius.md, padding: spacing.md },
  rowTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  title: { ...typography.title, flex: 1 },
  chevron: { fontSize: 12, color: colors.textTertiary },
  date: { ...typography.caption, marginTop: 4 },
  content: { ...typography.bodySecondary, marginTop: spacing.md, lineHeight: 22 },
});
