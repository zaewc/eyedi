import React from 'react';
import { Image, StyleSheet, Text, View, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, cardText, radius, spacing, fonts } from '@/theme';
import { MobileId, vcTypeName, VC_STATUS_LABEL, VcStatus } from '@/types';
import Taegeuk from './Taegeuk';

const logo = require('../../assets/img/logo.png');

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
}

export default function IdCard({ id, onPress }: Props) {
  const [c1, c2] = cardColors(id.vcType);
  const ink = cardText[id.vcType] ?? colors.navyText;
  const name = (id as any).name as string | undefined;
  const number = getNumber(id);
  const statusOk = id.vcStatus === VcStatus.NORMAL;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && { opacity: 0.94 }]}>
      <LinearGradient
        colors={[c1, c2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {!statusOk && (
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{VC_STATUS_LABEL[id.vcStatus]}</Text>
          </View>
        )}

        <View style={styles.row}>
          <View style={styles.photo}>
            <Text style={styles.photoInitial}>{name?.slice(0, 1) ?? '증'}</Text>
          </View>

          <View style={styles.info}>
            <Text style={[styles.typeName, { color: ink }]} numberOfLines={1}>
              {vcTypeName(id.vcType)}
            </Text>

            <View style={styles.symbolRow}>
              <View style={[styles.dot, { backgroundColor: ink, opacity: 0.35 }]} />
              <View style={[styles.dot, { backgroundColor: ink, opacity: 0.35 }]} />
              <View style={[styles.dot, { backgroundColor: ink, opacity: 0.35 }]} />
              <Taegeuk size={26} />
            </View>

            {!!number && (
              <Text style={[styles.number, { color: ink }]} numberOfLines={1}>
                {number}
              </Text>
            )}
            {!!name && (
              <Text style={[styles.holder, { color: ink }]} numberOfLines={1}>
                {name}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.footer}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
          <Text style={[styles.footerText, { color: ink }]}>~ {id.vcExpirationDate}</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

function getNumber(id: MobileId): string {
  const anyId = id as any;
  if (id.vcType === 'mdriverlic') return anyId.dlNo ?? '';
  return anyId.ihidNum ?? '';
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: spacing.lg,
    minHeight: 210,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(11,44,99,0.08)',
    shadowColor: '#0B2C63',
    shadowOpacity: 0.14,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  statusBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: colors.danger,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  statusText: { color: colors.textInverse, fontFamily: fonts.semibold, fontSize: 11 },
  row: { flexDirection: 'row', gap: spacing.md },
  photo: {
    width: 92,
    height: 116,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(11,44,99,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoInitial: { fontFamily: fonts.bold, fontSize: 34, color: '#B9C4D6' },
  info: { flex: 1, paddingTop: 2 },
  typeName: { fontFamily: fonts.bold, fontSize: 19 },
  symbolRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14 },
  dot: { width: 14, height: 14, borderRadius: 7 },
  number: { fontFamily: fonts.bold, fontSize: 20, marginTop: 12, letterSpacing: 0.5 },
  holder: { fontFamily: fonts.semibold, fontSize: 15, marginTop: 6 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  logo: { width: 30, height: 30 },
  footerText: { fontFamily: fonts.regular, fontSize: 12, opacity: 0.7 },
});
