import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { Header, Screen, Button } from '@/components/common';
import { colors, radius, spacing, typography } from '@/theme';
import { VpvService } from '@/data/services/vpvService';
import { useWalletStore } from '@/data/store/walletStore';

type Nav = NativeStackNavigationProp<RootStackParamList, 'ScanQR'>;

export default function ScanQRScreen() {
  const navigation = useNavigation<Nav>();
  const [permission, requestPermission] = useCameraPermissions();
  const ids = useWalletStore((s) => s.ids);
  const [handled, setHandled] = useState(false);

  const onScan = async (data: string) => {
    if (handled) return;
    setHandled(true);
    const profile = await VpvService.parseVerifierQr(data);
    const vcId = ids[0]?.vcId ?? '';
    navigation.replace('VerifyConfirm', { profile, vcId });
  };

  if (!permission) {
    return (
      <Screen>
        <Header title="QR 스캔" onBack={() => navigation.goBack()} />
      </Screen>
    );
  }

  if (!permission.granted) {
    return (
      <Screen>
        <Header title="QR 스캔" onBack={() => navigation.goBack()} />
        <View style={styles.permWrap}>
          <Text style={styles.permIcon}>📷</Text>
          <Text style={styles.permTitle}>카메라 권한이 필요합니다</Text>
          <Text style={styles.permDesc}>QR 코드를 스캔하려면 카메라 접근을 허용해 주세요.</Text>
          <Button title="권한 허용" onPress={requestPermission} style={{ marginTop: spacing.lg }} />
          <Button
            title="데모 QR로 계속"
            variant="ghost"
            onPress={() => onScan('{"trxcode":"TRX-DEMO"}')}
          />
        </View>
      </Screen>
    );
  }

  return (
    <View style={styles.root}>
      <CameraView
        style={StyleSheet.absoluteFill}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={({ data }) => onScan(data)}
      />
      <Header title="QR 스캔" onBack={() => navigation.goBack()} light />
      <View style={styles.overlay} pointerEvents="none">
        <View style={styles.frame} />
        <Text style={styles.guide}>검증 기관의 QR 코드를{'\n'}사각형 안에 맞춰 주세요.</Text>
      </View>
      <View style={styles.demoBtn}>
        <Pressable onPress={() => onScan('{"trxcode":"TRX-DEMO"}')}>
          <Text style={styles.demoText}>데모 QR로 계속 →</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    width: 240,
    height: 240,
    borderRadius: radius.lg,
    borderWidth: 3,
    borderColor: colors.textInverse,
  },
  guide: {
    ...typography.body,
    color: colors.textInverse,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  demoBtn: { position: 'absolute', bottom: 48, alignSelf: 'center' },
  demoText: { color: colors.textInverse, fontSize: 15, fontWeight: '600' },
  permWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  permIcon: { fontSize: 64, marginBottom: spacing.lg },
  permTitle: { ...typography.h3, marginBottom: spacing.sm },
  permDesc: { ...typography.bodySecondary, textAlign: 'center' },
});
