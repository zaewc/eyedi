import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import IdCard from '@/components/IdCard';
import { colors, radius, spacing, typography } from '@/theme';
import { useWalletStore } from '@/data/store/walletStore';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function WalletScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const ids = useWalletStore((s) => s.ids);

  return (
    <View style={styles.root}>
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.brand}>모바일 신분증</Text>
        <View style={styles.topActions}>
          <Pressable hitSlop={10} onPress={() => navigation.navigate('Notice')}>
            <Text style={styles.topIcon}>🔔</Text>
          </Pressable>
          <Pressable hitSlop={10} onPress={() => navigation.navigate('Settings')}>
            <Text style={styles.topIcon}>⚙️</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {ids.length === 0 ? (
          <EmptyWallet onIssue={() => navigation.navigate('Apply' as never)} />
        ) : (
          <>
            {ids.map((id) => (
              <View key={id.vcId} style={styles.cardWrap}>
                <IdCard id={id} onPress={() => navigation.navigate('IdDetail', { vcId: id.vcId })} />
              </View>
            ))}
          </>
        )}
      </ScrollView>

      {ids.length > 0 && (
        <View style={styles.presentBar}>
          <Pressable
            style={styles.scanBtn}
            onPress={() => navigation.navigate('ScanQR')}
          >
            <Text style={styles.scanText}>📷  QR 스캔</Text>
          </Pressable>
          <Pressable
            style={[styles.scanBtn, styles.presentBtn]}
            onPress={() => navigation.navigate('PresentQR', { vcId: ids[0].vcId })}
          >
            <Text style={[styles.scanText, styles.presentTextInv]}>제시하기</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

function EmptyWallet({ onIssue }: { onIssue: () => void }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyIcon}>🪪</Text>
      <Text style={styles.emptyTitle}>등록된 신분증이 없습니다</Text>
      <Text style={styles.emptyDesc}>발급 탭에서 모바일 신분증을 발급받으세요.</Text>
      <Pressable style={styles.emptyBtn} onPress={onIssue}>
        <Text style={styles.emptyBtnText}>신분증 발급받기</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  brand: { ...typography.h3, color: colors.primary },
  topActions: { flexDirection: 'row', gap: spacing.md },
  topIcon: { fontSize: 20 },
  body: { padding: spacing.lg, gap: spacing.lg, paddingBottom: 120 },
  cardWrap: {},
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyIcon: { fontSize: 64, marginBottom: spacing.lg },
  emptyTitle: { ...typography.h3, marginBottom: spacing.sm },
  emptyDesc: { ...typography.bodySecondary, textAlign: 'center', marginBottom: spacing.xl },
  emptyBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
  },
  emptyBtnText: { color: colors.textInverse, fontWeight: '600', fontSize: 15 },
  presentBar: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.lg,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  scanBtn: {
    flex: 1,
    height: 54,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  presentBtn: { backgroundColor: colors.primary, borderColor: colors.primary },
  scanText: { color: colors.primary, fontWeight: '700', fontSize: 15 },
  presentTextInv: { color: colors.textInverse },
});
