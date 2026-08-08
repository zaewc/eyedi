import React, { useEffect, useRef } from 'react';
import { Alert, Animated, Dimensions, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Accelerometer } from 'expo-sensors';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import { RootStackParamList } from '@/navigation/types';
import RealIdCard from '@/components/RealIdCard';
import { fonts, spacing } from '@/theme';
import { useWalletStore } from '@/data/store/walletStore';

type Nav = NativeStackNavigationProp<RootStackParamList, 'IdDetail'>;
type Rt = RouteProp<RootStackParamList, 'IdDetail'>;

const { width, height } = Dimensions.get('window');
const rolling = require('../../../assets/img/rolling.png');
const rollingInner = require('../../../assets/img/rolling_inner.png');

// v1 layout_main_full_detail: 다크네이비 + 회전 엠블럼 워터마크 + 90° 회전 카드 + NFC/닫기
export default function IdDetailScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { vcId } = useRoute<Rt>().params;
  const id = useWalletStore((s) => s.getId(vcId));

  const cardLen = Math.min(420, height * 0.56);
  const cardShort = cardLen / (355 / 217);

  // 기울임에 따라 움직이는 흰색 글레어(홀로그램) — 가속도계 기반
  const glow = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  useEffect(() => {
    Accelerometer.setUpdateInterval(60);
    const sub = Accelerometer.addListener(({ x, y }) => {
      Animated.spring(glow, {
        toValue: { x: x * 60, y: -y * 60 },
        useNativeDriver: true,
        speed: 18,
        bounciness: 3,
      }).start();
    });
    return () => sub.remove();
  }, []);

  // 진입 트랜지션: 카드 살짝 확대되며 등장
  const scale = useRef(new Animated.Value(0.9)).current;
  useEffect(() => {
    Animated.timing(scale, { toValue: 1, duration: 260, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, []);

  // 배경 엠블럼 회전 (홈과 동일: 바깥 CCW, 안쪽 CW)
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
  const embSize = width * 0.9;

  return (
    <LinearGradient colors={['#0F1C3D', '#0A1428']} style={styles.root}>
      {/* 기울임에 따라 움직이는 흰색 글레어 */}
      <Animated.View
        style={[styles.glowWrap, { transform: [{ translateX: glow.x }, { translateY: glow.y }] }]}
        pointerEvents="none"
      >
        <Svg width={width * 1.3} height={width * 1.3}>
          <Defs>
            <RadialGradient id="glow" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.22} />
              <Stop offset="45%" stopColor="#CFE0FF" stopOpacity={0.08} />
              <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Circle cx={width * 0.65} cy={width * 0.65} r={width * 0.65} fill="url(#glow)" />
        </Svg>
      </Animated.View>

      {/* 배경 엠블럼 워터마크 */}
      <View style={styles.embWrap} pointerEvents="none">
        <Animated.Image
          source={rolling}
          style={{ position: 'absolute', width: embSize, height: embSize, opacity: 0.06, tintColor: '#FFFFFF', transform: [{ rotate: rotateCcw }] }}
          resizeMode="contain"
        />
        <Animated.Image
          source={rollingInner}
          style={{ position: 'absolute', width: embSize * 0.85, height: embSize * 0.85, opacity: 0.07, tintColor: '#FFFFFF', transform: [{ rotate: rotateCw }] }}
          resizeMode="contain"
        />
      </View>

      <View style={styles.center}>
        {id && (
          <Animated.View style={{ width: cardShort, height: cardLen, alignItems: 'center', justifyContent: 'center', transform: [{ scale }] }}>
            <View style={{ transform: [{ rotate: '90deg' }] }}>
              <RealIdCard id={id} width={cardLen} variant="full" />
            </View>
          </Animated.View>
        )}
      </View>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + spacing.xl }]}>
        <Pressable onPress={() => Alert.alert('NFC 제출', 'NFC 제출은 이 데모(Expo)에서 지원되지 않습니다.')} hitSlop={8}>
          <Text style={styles.nfc}>NFC로 제출하기</Text>
        </Pressable>
        <Pressable style={styles.close} onPress={() => navigation.goBack()} hitSlop={8}>
          <Text style={styles.closeX}>✕</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  glowWrap: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  embWrap: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  bottom: { alignItems: 'center', gap: spacing.lg },
  nfc: { fontFamily: fonts.semibold, fontSize: 18, color: '#FFFFFF', textDecorationLine: 'underline' },
  close: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeX: { color: '#FFFFFF', fontSize: 24, lineHeight: 26, fontFamily: fonts.regular },
});
