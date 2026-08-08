import React from 'react';
import { Alert, Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '@/navigation/types';
import RealIdCard from '@/components/RealIdCard';
import { fonts, spacing } from '@/theme';
import { useWalletStore } from '@/data/store/walletStore';

type Nav = NativeStackNavigationProp<RootStackParamList, 'IdDetail'>;
type Rt = RouteProp<RootStackParamList, 'IdDetail'>;

const { width, height } = Dimensions.get('window');

// v1 layout_main_full_detail (mrc_detail_bg 다크네이비 + 90° 회전 카드 + NFC/닫기)
export default function IdDetailScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { vcId } = useRoute<Rt>().params;
  const id = useWalletStore((s) => s.getId(vcId));

  const cardLen = Math.min(height * 0.72, (width - 32) * (355 / 217));
  const cardShort = cardLen / (355 / 217);

  return (
    <LinearGradient colors={['#0F1C3D', '#0A1428']} style={styles.root}>
      <View style={styles.center}>
        {id && (
          <View style={{ width: cardShort, height: cardLen, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ transform: [{ rotate: '90deg' }] }}>
              <RealIdCard id={id} width={cardLen} variant="full" />
            </View>
          </View>
        )}
      </View>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + spacing.xl }]}>
        <Pressable
          onPress={() => Alert.alert('NFC 제출', 'NFC 제출은 이 데모(Expo)에서 지원되지 않습니다.')}
          hitSlop={8}
        >
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
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  bottom: { alignItems: 'center', gap: spacing.lg },
  nfc: {
    fontFamily: fonts.semibold,
    fontSize: 18,
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
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
