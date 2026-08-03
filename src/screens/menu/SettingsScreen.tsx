import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { Header, Screen, Dialog } from '@/components/common';
import { colors, radius, spacing, typography } from '@/theme';
import { useAuthStore } from '@/data/store/authStore';
import { useWalletStore } from '@/data/store/walletStore';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

export default function SettingsScreen() {
  const navigation = useNavigation<Nav>();
  const biometricEnabled = useAuthStore((s) => s.biometricEnabled);
  const setBiometric = useAuthStore((s) => s.setBiometric);
  const resetAuth = useAuthStore((s) => s.reset);
  const clearWallet = useWalletStore((s) => s.clear);
  const [confirmReset, setConfirmReset] = useState(false);

  const doReset = async () => {
    await Promise.all([resetAuth(), clearWallet()]);
    setConfirmReset(false);
    navigation.reset({ index: 0, routes: [{ name: 'Splash' }] });
  };

  return (
    <Screen background={colors.surface}>
      <Header title="환경설정" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>생체 인증 사용</Text>
            <Switch
              value={biometricEnabled}
              onValueChange={setBiometric}
              trackColor={{ true: colors.primary }}
            />
          </View>
          <View style={styles.divider} />
          <Pressable
            style={styles.row}
            onPress={() => navigation.navigate('SetPin', { mode: 'change' })}
          >
            <Text style={styles.label}>비밀번호 변경</Text>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Pressable style={styles.row} onPress={() => setConfirmReset(true)}>
            <Text style={[styles.label, { color: colors.danger }]}>앱 초기화</Text>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        </View>
      </ScrollView>

      <Dialog
        visible={confirmReset}
        title="앱 초기화"
        message={'모든 신분증과 설정이 삭제됩니다.\n계속하시겠습니까?'}
        cancelText="취소"
        confirmText="초기화"
        onCancel={() => setConfirmReset(false)}
        onConfirm={doReset}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg, gap: spacing.lg },
  card: { backgroundColor: colors.background, borderRadius: radius.md, overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  divider: { height: 1, backgroundColor: colors.divider },
  label: { ...typography.body },
  chevron: { fontSize: 22, color: colors.textTertiary },
});
