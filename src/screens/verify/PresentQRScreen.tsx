import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { Header, Screen } from '@/components/common';
import { colors, radius, spacing, typography } from '@/theme';
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

  return (
    <Screen background={colors.primary}>
      <Header title="신분증 제시" onBack={() => navigation.goBack()} light />
      <View style={styles.body}>
        <Text style={styles.title}>{id ? vcTypeName(id.vcType) : ''}</Text>
        <Text style={styles.subtitle}>검증 기관에 QR 코드를 보여주세요.</Text>

        <View style={styles.qrBox}>
          {payload ? (
            <QRCode value={payload} size={220} />
          ) : (
            <ActivityIndicator size="large" color={colors.primary} />
          )}
        </View>

        <Text style={styles.timer}>{countdown}초 후 자동 갱신</Text>
        <Text style={styles.notice}>
          QR 코드는 보안을 위해 주기적으로 갱신됩니다.{'\n'}타인에게 화면을 캡처하도록 허용하지 마세요.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, alignItems: 'center', paddingTop: spacing.xl, paddingHorizontal: spacing.lg },
  title: { ...typography.h2, color: colors.textInverse },
  subtitle: { ...typography.body, color: 'rgba(255,255,255,0.85)', marginTop: spacing.sm },
  qrBox: {
    marginTop: spacing.xxl,
    width: 280,
    height: 280,
    borderRadius: radius.lg,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timer: { ...typography.title, color: colors.textInverse, marginTop: spacing.xl },
  notice: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
