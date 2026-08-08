import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import RealIdCard from '@/components/RealIdCard';
import QrSheet from '@/components/QrSheet';
import { MenuIcon, AddIcon, QrShowIcon, QrCaptureIcon } from '@/components/icons';
import { colors, fonts, spacing } from '@/theme';
import { useWalletStore } from '@/data/store/walletStore';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');
const H_PAD = spacing.lg;

const illust = require('../../../assets/img/issue_complete.png');

// v1 fragment_main 대응: 상단바(메뉴/타이틀/발급) + 카드 + 하단 QR바 + QR 바텀시트
export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const ids = useWalletStore((s) => s.ids);
  const [page, setPage] = useState(0);
  const [qrOpen, setQrOpen] = useState(false);
  const [areaH, setAreaH] = useState(0);
  const listRef = useRef<FlatList>(null);
  const current = ids[page] ?? ids[0];

  // v1은 카드(가로 355x217)를 90° 회전해 화면에서 세로로 크게 표시한다.
  const cardLen = Math.min(areaH * 0.94, (width - H_PAD * 2) * (355 / 217));
  const cardShort = cardLen / (355 / 217);

  return (
    <View style={styles.root}>
      {/* 상단바: [메뉴] 모바일 신분증 [＋] */}
      <View style={[styles.topBar, { paddingTop: insets.top, height: 60 + insets.top }]}>
        <Pressable style={styles.topBtn} hitSlop={8} onPress={() => navigation.navigate('Menu')}>
          <MenuIcon size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>모바일 신분증</Text>
        <Pressable style={styles.topBtn} hitSlop={8} onPress={() => navigation.navigate('Apply')}>
          <AddIcon size={22} color={colors.text} />
        </Pressable>
      </View>

      {ids.length === 0 ? (
        <View style={styles.empty}>
          <Image source={illust} style={styles.emptyImg} resizeMode="contain" />
          <Text style={styles.emptyTitle}>등록된 신분증이 없습니다</Text>
          <Text style={styles.emptyDesc}>모바일 신분증을 발급받아 보세요.</Text>
          <Pressable style={styles.emptyBtn} onPress={() => navigation.navigate('Apply')}>
            <Text style={styles.emptyBtnText}>신분증 발급받기</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <View style={styles.cardArea} onLayout={(e) => setAreaH(e.nativeEvent.layout.height)}>
            {areaH > 0 && (
              <FlatList
                ref={listRef}
                data={ids}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.vcId}
                snapToInterval={width}
                decelerationRate="fast"
                onMomentumScrollEnd={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / width))}
                renderItem={({ item }) => (
                  <View style={[styles.page, { width }]}>
                    <View style={{ width: cardShort, height: cardLen, alignItems: 'center', justifyContent: 'center' }}>
                      <View style={{ transform: [{ rotate: '90deg' }] }}>
                        <RealIdCard
                          id={item}
                          width={cardLen}
                          variant="front"
                          onPress={() => navigation.navigate('IdDetail', { vcId: item.vcId })}
                        />
                      </View>
                    </View>
                  </View>
                )}
              />
            )}
            {ids.length > 1 && (
              <View style={styles.dots}>
                {ids.map((_, i) => (
                  <View key={i} style={[styles.dot, i === page && styles.dotActive]} />
                ))}
              </View>
            )}
          </View>

          {/* 하단 QR 바: 나의 QR | QR 촬영 */}
          <View style={[styles.bottomBar, { paddingBottom: insets.bottom }]}>
            <Pressable style={styles.bottomBtn} onPress={() => setQrOpen(true)}>
              <QrShowIcon size={26} />
              <Text style={styles.bottomText}>나의 QR</Text>
            </Pressable>
            <View style={styles.vline} />
            <Pressable style={styles.bottomBtn} onPress={() => navigation.navigate('ScanQR')}>
              <QrCaptureIcon size={26} />
              <Text style={styles.bottomText}>QR 촬영</Text>
            </Pressable>
          </View>
        </>
      )}

      <QrSheet visible={qrOpen} id={current} onClose={() => setQrOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
  },
  topBtn: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fonts.bold, fontSize: 18, color: '#111111' },
  cardArea: { flex: 1, justifyContent: 'center' },
  page: { alignItems: 'center', justifyContent: 'center' },
  dots: { position: 'absolute', bottom: 8, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 6 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.border },
  dotActive: { backgroundColor: colors.primary, width: 18 },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 70,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
  },
  bottomBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: '100%' },
  bottomText: { fontFamily: fonts.bold, fontSize: 16, color: '#39434e' },
  vline: { width: 1, height: 40, backgroundColor: colors.divider },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  emptyImg: { width: 200, height: 180, marginBottom: spacing.lg },
  emptyTitle: { fontFamily: fonts.bold, fontSize: 18, color: colors.text, marginBottom: spacing.xs },
  emptyDesc: { fontFamily: fonts.regular, fontSize: 14, color: colors.textSecondary, marginBottom: spacing.xl },
  emptyBtn: { backgroundColor: colors.primary, paddingHorizontal: spacing.xl, paddingVertical: 14, borderRadius: 999 },
  emptyBtnText: { fontFamily: fonts.bold, color: colors.textInverse, fontSize: 15 },
});
