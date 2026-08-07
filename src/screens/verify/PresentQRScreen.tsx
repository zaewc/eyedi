import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { Header, Screen } from '@/components/common';
import Taegeuk from '@/components/Taegeuk';
import { colors, fonts, radius, spacing } from '@/theme';
import { useWalletStore } from '@/data/store/walletStore';
import { VpvService } from '@/data/services/vpvService';
import { vcTypeName, VerifiablePresentation } from '@/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'PresentQR'>;
type Rt = RouteProp<RootStackParamList, 'PresentQR'>;

const REFRESH_SEC = 30;

export default function PresentQRScreen() {
  const navigation = useNavigation<Nav>();
  const { vcId } = useRoute<Rt>().params;
  const id = useWalletStore((s) => s.getId(vcId));
  const [payload, setPayload] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(REFRESH_SEC);

  const regenerate = async () => {
    if (!id) return;
    const vp: VerifiablePresentation = {
      trxCode: `CPM-${Date.now()}`,
      vcId: id.vcId,
      vcType: id.vcType,
      disclosedClaims: {
        name: (id as any).name ?? '',
        birthday: (id as any).birthday ?? (id as any).birth ?? '',
      },
      createdAt: new Date().toISOString(),
    };
    const p = await VpvService.createPresentationPayload(vp);
    setPayload(p);
    setCountdown(REFRESH_SEC);
  };

  useEffect(() => {
    regenerate();
    const t = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          regenerate();
          return REFRESH_SEC;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [vcId]);

  const holder = (id as any)?.name as string | undefined;

  return (
    <Screen background={colors.surface}>
      <LinearGradient colors={[colors.primaryDark, colors.primary]} style={StyleSheet.absoluteFill} />
      <Header title="본인확인 QR" onBack={() => navigation.goBack()} light />
      <View style={styles.body}>
        <Text style={styles.title}>{id ? vcTypeName(id.vcType) : ''}</Text>
        <Text style={styles.subtitle}>검증 기관에 QR 코드를 보여주세요</Text>

        <View style={styles.qrCard}>
          <View style={styles.qrHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{holder?.slice(0, 1) ?? '증'}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.qrName}>{holder ?? ''}</Text>
              <Text style={styles.qrType}>{id ? vcTypeName(id.vcType) : ''}</Text>
            </View>
            <Taegeuk size={30} />
          </View>

          <View style={styles.qrBox}>
            {payload ? (
              <QRCode value={payload} size={210} />
            ) : (
              <ActivityIndicator size="large" color={colors.primary} />
            )}
          </View>

          <View style={styles.timerRow}>
            <View style={styles.timerDot} />
            <Text style={styles.timer}>{countdown}초 후 자동 갱신</Text>
          </View>
        </View>

        <Text style={styles.notice}>
          QR 코드는 보안을 위해 주기적으로 갱신됩니다.{'\n'}화면 캡처·전송에 유의하세요.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, alignItems: 'center', paddingTop: spacing.lg, paddingHorizontal: spacing.lg },
  title: { fontFamily: fonts.bold, fontSize: 22, color: colors.textInverse },
  subtitle: { fontFamily: fonts.regular, fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: 6 },
  qrCard: {
    marginTop: spacing.xl,
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.background,
    borderRadius: radius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  qrHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, width: '100%' },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: fonts.bold, fontSize: 18, color: colors.textTertiary },
  qrName: { fontFamily: fonts.bold, fontSize: 16, color: colors.navyText },
  qrType: { fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary },
  qrBox: {
    marginTop: spacing.lg,
    width: 246,
    height: 246,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.divider,
  },
  timerRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.md },
  timerDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent },
  timer: { fontFamily: fonts.semibold, fontSize: 15, color: colors.primary },
  notice: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: spacing.xl,
    lineHeight: 18,
  },
});
