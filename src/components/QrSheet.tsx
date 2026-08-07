import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import { colors, fonts, radius, spacing } from '@/theme';
import { ClockIcon } from './icons';
import { VpvService } from '@/data/services/vpvService';
import { MobileId, VerifiablePresentation, vcTypeName } from '@/types';

const REFRESH_SEC = 30;

interface Props {
  visible: boolean;
  id?: MobileId;
  onClose: () => void;
}

// v1 fragment_main 의 QR 바텀시트(나의 QR) 대응
export default function QrSheet({ visible, id, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const [payload, setPayload] = useState<string | null>(null);
  const [left, setLeft] = useState(REFRESH_SEC);

  useEffect(() => {
    if (!visible || !id) return;
    let alive = true;
    const regen = async () => {
      const vp: VerifiablePresentation = {
        trxCode: `CPM-${Date.now()}`,
        vcId: id.vcId,
        vcType: id.vcType,
        disclosedClaims: { name: (id as any).name ?? '' },
        createdAt: new Date().toISOString(),
      };
      const p = await VpvService.createPresentationPayload(vp);
      if (alive) {
        setPayload(p);
        setLeft(REFRESH_SEC);
      }
    };
    regen();
    const t = setInterval(() => {
      setLeft((c) => {
        if (c <= 1) {
          regen();
          return REFRESH_SEC;
        }
        return c - 1;
      });
    }, 1000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [visible, id?.vcId]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={[styles.sheet, { paddingBottom: insets.bottom + spacing.xl }]} onPress={() => {}}>
          <View style={styles.handle} />
          <Text style={styles.title}>나의 QR</Text>
          {id && <Text style={styles.sub}>{vcTypeName(id.vcType)}</Text>}

          <View style={styles.qrBox}>
            {payload ? <QRCode value={payload} size={220} /> : <ActivityIndicator color={colors.primary} size="large" />}
          </View>

          <View style={styles.timerRow}>
            <ClockIcon size={18} color={colors.text} />
            <Text style={styles.timerLabel}>남은 시간</Text>
            <Text style={styles.timerValue}>{left}초</Text>
          </View>
          <Text style={styles.notice}>검증 기관에 QR을 제시하세요. 30초마다 자동 갱신됩니다.</Text>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  handle: { width: 80, height: 5, borderRadius: 3, backgroundColor: '#E2E2E2', marginBottom: spacing.lg },
  title: { fontFamily: fonts.bold, fontSize: 20, color: colors.text },
  sub: { fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  qrBox: {
    width: 260,
    height: 260,
    borderRadius: radius.md,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  timerRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.lg },
  timerLabel: { fontFamily: fonts.semibold, fontSize: 16, color: colors.text },
  timerValue: { fontFamily: fonts.semibold, fontSize: 16, color: colors.primary },
  notice: { fontFamily: fonts.regular, fontSize: 12, color: colors.textTertiary, marginTop: spacing.sm, textAlign: 'center' },
});
