import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { Button, Header, Screen } from '@/components/common';
import { colors, radius, spacing, typography } from '@/theme';
import { AppHttpService } from '@/data/services/httpService';
import { Tos } from '@/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Terms'>;

export default function TermsScreen() {
  const navigation = useNavigation<Nav>();
  const [tos, setTos] = useState<Tos[]>([]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    AppHttpService.getTos().then((r) => setTos(r.data ?? []));
  }, []);

  const allChecked = tos.length > 0 && tos.every((t) => checked[t.tosId]);
  const requiredChecked = useMemo(
    () => tos.filter((t) => t.required).every((t) => checked[t.tosId]),
    [tos, checked],
  );

  const toggle = (id: string) => setChecked((c) => ({ ...c, [id]: !c[id] }));
  const toggleAll = () => {
    const next = !allChecked;
    setChecked(Object.fromEntries(tos.map((t) => [t.tosId, next])));
  };

  return (
    <Screen>
      <Header title="약관 동의" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.heading}>서비스 이용을 위해{'\n'}약관에 동의해 주세요.</Text>

        <Pressable style={styles.allRow} onPress={toggleAll}>
          <CheckBox checked={allChecked} />
          <Text style={styles.allText}>약관 전체 동의</Text>
        </Pressable>

        <View style={styles.divider} />

        {tos.map((t) => (
          <Pressable key={t.tosId} style={styles.row} onPress={() => toggle(t.tosId)}>
            <CheckBox checked={!!checked[t.tosId]} />
            <Text style={styles.rowText}>{t.title}</Text>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="동의하고 계속"
          disabled={!requiredChecked}
          onPress={() => navigation.navigate('PhoneAuth')}
        />
      </View>
    </Screen>
  );
}

function CheckBox({ checked }: { checked: boolean }) {
  return (
    <View style={[styles.checkbox, checked && styles.checkboxOn]}>
      {checked && <Text style={styles.checkMark}>✓</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg },
  heading: { ...typography.h2, marginBottom: spacing.xl },
  allRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  allText: { ...typography.title, marginLeft: spacing.md },
  divider: { height: 1, backgroundColor: colors.divider, marginVertical: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md },
  rowText: { ...typography.body, flex: 1, marginLeft: spacing.md },
  chevron: { fontSize: 22, color: colors.textTertiary },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkMark: { color: colors.textInverse, fontSize: 14, fontWeight: '700' },
  footer: { padding: spacing.lg },
});
