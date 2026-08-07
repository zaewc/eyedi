import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import RealIdCard from '@/components/RealIdCard';
import { colors, fonts, radius, spacing, typography } from '@/theme';
import { useWalletStore } from '@/data/store/walletStore';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');
const H_PAD = spacing.lg;

const logo = require('../../../assets/img/logo.png');
const illust = require('../../../assets/img/issue_complete.png');

export default function WalletScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const ids = useWalletStore((s) => s.ids);
  const [page, setPage] = useState(0);
  const listRef = useRef<FlatList>(null);

  const current = ids[page] ?? ids[0];

  const cardW = width - H_PAD * 2;

  return (
    <View style={styles.root}>
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <View style={styles.brandRow}>
          <Image source={logo} style={styles.brandLogo} resizeMode="contain" />
          <Text style={styles.brand}>모바일 신분증</Text>
        </View>
        <View style={styles.topActions}>
          <Pressable hitSlop={10} onPress={() => navigation.navigate('Notice')}>
            <Text style={styles.topIcon}>🔔</Text>
          </Pressable>
          <Pressable hitSlop={10} onPress={() => navigation.navigate('Settings')}>
            <Text style={styles.topIcon}>☰</Text>
          </Pressable>
        </View>
      </View>

      {ids.length === 0 ? (
        <EmptyWallet illust={illust} onIssue={() => navigation.navigate('Apply' as never)} />
      ) : (
        <>
          <View style={styles.cardArea}>
            {(
              <FlatList
                ref={listRef}
                data={ids}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.vcId}
                snapToInterval={width}
                decelerationRate="fast"
                onMomentumScrollEnd={(e) =>
                  setPage(Math.round(e.nativeEvent.contentOffset.x / width))
                }
                renderItem={({ item }) => (
                  <View style={[styles.page, { width }]}>
                    <RealIdCard
                      id={item}
                      width={cardW}
                      variant="front"
                      onPress={() => navigation.navigate('IdDetail', { vcId: item.vcId })}
                    />
                  </View>
                )}
              />
            )}
          </View>

          {ids.length > 1 && (
            <View style={styles.dots}>
              {ids.map((_, i) => (
                <View key={i} style={[styles.dot, i === page && styles.dotActive]} />
              ))}
            </View>
          )}

          <View style={[styles.actions, { paddingBottom: spacing.md }]}>
            <Pressable
              style={styles.qrButton}
              onPress={() => current && navigation.navigate('PresentQR', { vcId: current.vcId })}
            >
              <Text style={styles.qrGlyphText}>▣</Text>
              <Text style={styles.qrButtonText}>본인확인 QR 제시</Text>
            </Pressable>
            <Pressable style={styles.scanButton} onPress={() => navigation.navigate('ScanQR')}>
              <Text style={styles.scanButtonText}>QR 스캔하기</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

function EmptyWallet({ illust, onIssue }: { illust: number; onIssue: () => void }) {
  return (
    <View style={styles.empty}>
      <Image source={illust} style={styles.emptyImg} resizeMode="contain" />
      <Text style={styles.emptyTitle}>등록된 신분증이 없습니다</Text>
      <Text style={styles.emptyDesc}>모바일 신분증을 발급받아 보세요.</Text>
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
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandLogo: { width: 26, height: 26 },
  brand: { fontFamily: fonts.bold, fontSize: 18, color: colors.navyText },
  topActions: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  topIcon: { fontSize: 20, color: colors.navyText },
  cardArea: { flex: 1 },
  page: { alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.md },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: spacing.sm },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.border },
  dotActive: { backgroundColor: colors.primary, width: 18 },
  actions: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  qrGlyphText: { fontSize: 20, color: colors.textInverse },
  qrButtonText: { fontFamily: fonts.bold, fontSize: 17, color: colors.textInverse },
  scanButton: {
    height: 50,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  scanButtonText: { fontFamily: fonts.semibold, fontSize: 15, color: colors.navyText },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  emptyImg: { width: 200, height: 180, marginBottom: spacing.lg },
  emptyTitle: { ...typography.h3, marginBottom: spacing.xs },
  emptyDesc: { ...typography.bodySecondary, marginBottom: spacing.xl },
  emptyBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: 14,
    borderRadius: radius.pill,
  },
  emptyBtnText: { fontFamily: fonts.bold, color: colors.textInverse, fontSize: 15 },
});
