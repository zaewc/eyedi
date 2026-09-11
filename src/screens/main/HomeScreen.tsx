import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, FlatList, Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import RealIdCard from '@/components/RealIdCard';
import QrSheet from '@/components/QrSheet';
import { MenuIcon, AddIcon, QrShowIcon, QrCaptureIcon, ClockIcon } from '@/components/icons';
import { colors, fonts, spacing } from '@/theme';
import { useWalletStore } from '@/data/store/walletStore';

// v1 bottom_sheet_legal_* 문구 (mrc는 문자열 미제공 → 표준 문구)
const LEGAL: Record<string, { title: string; main: string; sub: string }> = {
  mdriverlic: {
    title: '모바일 운전면허증의 법적 효력',
    main: '모바일 운전면허증은 도로교통법 제85조의2에 따라 일반 운전면허증과 동일하게 사용할 수 있습니다.',
    sub: '관계기관 등에서는 모바일 운전면허증이 원활히 사용될 수 있도록 협조하여 주시기 바랍니다.',
  },
  identitycard: {
    title: '모바일 주민등록증의 법적 효력',
    main: '모바일 주민등록증은 관계 법령에 따라 실물 주민등록증과 동일한 효력을 가집니다.',
    sub: '관계기관 등에서는 모바일 주민등록증이 원활히 사용될 수 있도록 협조하여 주시기 바랍니다.',
  },
  nationmerit: {
    title: '모바일 국가보훈등록증의 법적 효력',
    main: '모바일 국가보훈등록증은 관계 법령에 따라 실물 국가보훈등록증과 동일한 효력을 가집니다.',
    sub: '관계기관 등에서는 모바일 국가보훈등록증이 원활히 사용될 수 있도록 협조하여 주시기 바랍니다.',
  },
};
function legalFor(t: string) {
  return LEGAL[t] ?? { title: '법적 효력', main: '실물 신분증과 동일한 효력을 가집니다.', sub: '' };
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
function formatNow(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  const ap = d.getHours() < 12 ? '오전' : '오후';
  const h12 = d.getHours() % 12 || 12;
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())} (${WEEKDAYS[d.getDay()]}) ${ap} ${p(h12)}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

// 시계만 매초 갱신되도록 분리 (홈 전체 리렌더 방지 → 엠블럼 애니 끊김 해결)
function LiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <View style={styles.clockRow}>
      <ClockIcon size={20} color="#000000" />
      <Text style={styles.clockText}>{formatNow(now)}</Text>
    </View>
  );
}

type Nav = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');
const H_PAD = spacing.lg;

const illust = require('../../../assets/img/issue_complete.png');
const rolling = require('../../../assets/img/rolling.png');
const rollingInner = require('../../../assets/img/rolling_inner.png');

// v1 fragment_main 대응: 상단바(메뉴/타이틀/발급) + 카드 + 하단 QR바 + QR 바텀시트
export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const ids = useWalletStore((s) => s.ids);
  const [page, setPage] = useState(0);
  const [qrOpen, setQrOpen] = useState(false);
  const [legalOpen, setLegalOpen] = useState(false);
  const [areaH, setAreaH] = useState(0);
  const listRef = useRef<FlatList>(null);
  const current = ids[page] ?? ids[0];

  // 배경 행정안전부 엠블럼 (v1 ani_main_rolling): 바깥 텍스트링 CCW, 안쪽 태극 CW
  const spinOuter = useRef(new Animated.Value(0)).current;
  const spinInner = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const a1 = Animated.loop(Animated.timing(spinOuter, { toValue: 1, duration: 28000, easing: Easing.linear, useNativeDriver: true }));
    const a2 = Animated.loop(Animated.timing(spinInner, { toValue: 1, duration: 20000, easing: Easing.linear, useNativeDriver: true }));
    a1.start();
    a2.start();
    return () => {
      a1.stop();
      a2.stop();
    };
  }, []);
  const rotateCcw = spinOuter.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-360deg'] });
  const rotateCw = spinInner.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  // 회전한 카드 비율을 유지하면서 시계와 하단 버튼 공간을 확보한다.
  const cardLen = Math.max(0, Math.min(430, (width - H_PAD * 2) * (355 / 217), areaH - 140));
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
            <Animated.Image source={rolling} style={[styles.rolling, { transform: [{ rotate: rotateCcw }] }]} resizeMode="contain" />
            <Animated.Image source={rollingInner} style={[styles.rollingInner, { transform: [{ rotate: rotateCw }] }]} resizeMode="contain" />
            <LiveClock />
            {areaH > 0 && (
              <FlatList
                ref={listRef}
                data={ids}
                horizontal
                pagingEnabled
                style={{ height: cardLen, flexGrow: 0 }}
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

            {/* 카드 하단: 크게 보기 | 법적 효력 (v1 fragment_main_detail) */}
            <View style={[styles.cardBtnRow, { width: cardShort }]}>
              <Pressable
                style={styles.cardBtn}
                onPress={() => current && navigation.navigate('IdDetail', { vcId: current.vcId })}
              >
                <Text style={styles.cardBtnText}>크게 보기</Text>
              </Pressable>
              <Pressable style={styles.cardBtn} onPress={() => setLegalOpen(true)}>
                <Text style={styles.cardBtnText}>법적 효력</Text>
              </Pressable>
            </View>
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

      <Modal visible={legalOpen} transparent animationType="slide" onRequestClose={() => setLegalOpen(false)}>
        <Pressable style={styles.legalBackdrop} onPress={() => setLegalOpen(false)}>
          <Pressable style={[styles.legalSheet, { paddingBottom: insets.bottom + spacing.xl }]} onPress={() => {}}>
            <View style={styles.legalHandle} />
            <Text style={styles.legalTitle}>{legalFor(current?.vcType ?? '').title}</Text>
            <Text style={styles.legalMain}>{legalFor(current?.vcType ?? '').main}</Text>
            {!!legalFor(current?.vcType ?? '').sub && (
              <Text style={styles.legalSub}>{legalFor(current?.vcType ?? '').sub}</Text>
            )}
            <Pressable style={styles.legalClose} onPress={() => setLegalOpen(false)}>
              <Text style={styles.legalCloseText}>확인</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
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
  rolling: { position: 'absolute', top: 4, right: -50, width: 230, height: 230, opacity: 0.9, pointerEvents: 'none' },
  rollingInner: { position: 'absolute', top: 21, right: -33, width: 196, height: 196, opacity: 0.95, pointerEvents: 'none' },
  clockRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 28 },
  clockText: { fontFamily: fonts.semibold, fontSize: 18, lineHeight: 26, color: '#000000' },
  page: { alignItems: 'center', justifyContent: 'center' },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: spacing.sm },
  cardBtnRow: { flexDirection: 'row', gap: 5, alignSelf: 'center', marginTop: spacing.sm },
  cardBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E4EA',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  cardBtnText: { fontFamily: fonts.semibold, fontSize: 16, color: '#111111' },
  legalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  legalSheet: { backgroundColor: colors.background, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingTop: spacing.md, paddingHorizontal: spacing.lg },
  legalHandle: { width: 80, height: 5, borderRadius: 3, backgroundColor: '#E2E2E2', alignSelf: 'center', marginBottom: spacing.lg },
  legalTitle: { fontFamily: fonts.bold, fontSize: 19, color: '#111111', marginBottom: spacing.md },
  legalMain: { fontFamily: fonts.semibold, fontSize: 15, color: colors.text, lineHeight: 23 },
  legalSub: { fontFamily: fonts.regular, fontSize: 14, color: colors.textSecondary, lineHeight: 21, marginTop: spacing.md },
  legalClose: { marginTop: spacing.xl, height: 52, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  legalCloseText: { fontFamily: fonts.bold, fontSize: 16, color: colors.textInverse },
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
