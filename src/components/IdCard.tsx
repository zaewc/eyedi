import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, spacing, typography } from '@/theme';
import { MobileId, vcTypeName, VC_STATUS_LABEL, VcStatus } from '@/types';

function cardColors(vcType: string): [string, string] {
  switch (vcType) {
    case 'mdriverlic':
      return colors.cardDriver as unknown as [string, string];
    case 'identitycard':
    case 'rsdcard':
      return colors.cardResident as unknown as [string, string];
    case 'prmntrsdcard':
    case 'ovkorrsdcard':
      return colors.cardForeign as unknown as [string, string];
    case 'nationmerit':
    case 'indepatriot':
      return colors.cardMerit as unknown as [string, string];
    default:
      return colors.cardDefault as unknown as [string, string];
  }
}

interface Props {
  id: MobileId;
  onPress?: () => void;
  compact?: boolean;
}

export default function IdCard({ id, onPress, compact }: Props) {
  const [c1, c2] = cardColors(id.vcType);
  const name = (id as any).name as string | undefined;
  const holder = name ?? '';
  const subtitle = getSubtitle(id);
  const statusOk = id.vcStatus === VcStatus.NORMAL;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && { opacity: 0.92 }]}>
      <LinearGradient
        colors={[c1, c2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, compact && styles.compact]}
      >
        <View style={styles.header}>
          <View style={styles.emblem}>
            <Text style={styles.emblemText}>대한민국</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusOk ? 'rgba(255,255,255,0.22)' : colors.danger },
            ]}
          >
            <Text style={styles.statusText}>{VC_STATUS_LABEL[id.vcStatus]}</Text>
          </View>
        </View>

        <Text style={styles.typeName}>{vcTypeName(id.vcType)}</Text>

        <View style={styles.body}>
          <View style={styles.photo}>
            <Text style={styles.photoPlaceholder}>{holder.slice(0, 1) || '증'}</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.holder}>{holder}</Text>
            {!!subtitle && <Text style={styles.sub}>{subtitle}</Text>}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            발급일 {id.vcIssuanceDate} · 유효기간 {id.vcExpirationDate}
          </Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

function getSubtitle(id: MobileId): string {
  if (id.vcType === 'mdriverlic') {
    return `${(id as any).asort ?? ''}  ${(id as any).dlNo ?? ''}`.trim();
  }
  if ('ihidNum' in id && (id as any).ihidNum) {
    return (id as any).ihidNum;
  }
  return '';
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    padding: spacing.lg,
    minHeight: 220,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  compact: { minHeight: 150, padding: spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  emblem: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  emblemText: { color: colors.textInverse, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  statusBadge: { paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radius.pill },
  statusText: { color: colors.textInverse, fontSize: 12, fontWeight: '600' },
  typeName: { color: colors.textInverse, fontSize: 20, fontWeight: '700', marginTop: spacing.md },
  body: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.sm },
  photo: {
    width: 56,
    height: 72,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPlaceholder: { color: colors.textInverse, fontSize: 24, fontWeight: '700' },
  info: { flex: 1 },
  holder: { color: colors.textInverse, fontSize: 22, fontWeight: '700' },
  sub: { color: 'rgba(255,255,255,0.85)', fontSize: 14, marginTop: 4 },
  footer: { marginTop: spacing.md },
  footerText: { color: 'rgba(255,255,255,0.75)', fontSize: 11 },
});
