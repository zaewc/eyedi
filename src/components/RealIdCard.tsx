import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Rect, Defs, LinearGradient as SvgGrad, Stop } from 'react-native-svg';
import { colors, fonts } from '@/theme';
import { MobileId, vcTypeName, VcStatus, VC_STATUS_LABEL } from '@/types';
import GuillochePattern from './GuillochePattern';
import Taegeuk from './Taegeuk';

const logo = require('../../assets/img/logo.png');

interface Theme {
  bg: [string, string];
  ink: string;
  sub: string;
  accent: string;
  photoBg: string;
}

const THEMES: Record<string, Theme> = {
  mdriverlic: { bg: ['#F5FAFF', '#E1EEFB'], ink: '#0B2C63', sub: '#3E5C86', accent: '#1E5AA8', photoBg: '#D9E6F5' },
  identitycard: { bg: ['#F3F9F4', '#E0EFE4'], ink: '#1C4B32', sub: '#3D6B50', accent: '#2E7D52', photoBg: '#DCEBE0' },
  rsdcard: { bg: ['#F3F9F4', '#E0EFE4'], ink: '#1C4B32', sub: '#3D6B50', accent: '#2E7D52', photoBg: '#DCEBE0' },
  prmntrsdcard: { bg: ['#F3F3FC', '#E3E5F6'], ink: '#33306B', sub: '#565393', accent: '#4A46A0', photoBg: '#E1E2F2' },
  ovkorrsdcard: { bg: ['#F3F3FC', '#E3E5F6'], ink: '#33306B', sub: '#565393', accent: '#4A46A0', photoBg: '#E1E2F2' },
  nationmerit: { bg: ['#FBF4F1', '#F1E2DD'], ink: '#7A3B2E', sub: '#9A5647', accent: '#A8503C', photoBg: '#EFDFDA' },
  indepatriot: { bg: ['#FBF4F1', '#F1E2DD'], ink: '#7A3B2E', sub: '#9A5647', accent: '#A8503C', photoBg: '#EFDFDA' },
  default: { bg: ['#F6F8FB', '#E7ECF3'], ink: '#334155', sub: '#5A6472', accent: '#5A6472', photoBg: '#E3E8EF' },
};

function themeFor(t: string): Theme {
  return THEMES[t] ?? THEMES.default;
}

function maskRrn(rrn: string | undefined): string {
  if (!rrn) return '';
  const digits = rrn.replace(/[^0-9]/g, '');
  if (digits.length >= 7) return `${digits.slice(0, 6)}-${digits.slice(6, 7)}******`;
  return rrn;
}

interface Field {
  label: string;
  value: string;
}

function buildFields(id: MobileId, full: boolean): Field[] {
  const a = id as any;
  const rrn = full ? a.ihidNum ?? '' : maskRrn(a.ihidNum);
  const fields: Field[] = [];
  if (a.address) fields.push({ label: '주소', value: a.address });
  if (id.vcType === 'mdriverlic') {
    if (a.dlNo) fields.push({ label: '면허번호', value: a.dlNo });
    if (a.asort) fields.push({ label: '종별', value: a.asort });
    fields.push({ label: '발급일', value: id.vcIssuanceDate });
    if (a.aptdInspectEnd) fields.push({ label: '적성검사', value: `~ ${a.aptdInspectEnd}` });
  } else {
    fields.push({ label: '발급일', value: id.vcIssuanceDate });
  }
  return fields.concat(rrn ? [] : []);
}

function issuerName(id: MobileId): string {
  const a = id as any;
  return a.issuerName ?? a.issuernm ?? a.engissuernm ?? '대한민국';
}

interface Props {
  id: MobileId;
  width: number;
  variant?: 'front' | 'full';
  onPress?: () => void;
}

export default function RealIdCard({ id, width, variant = 'front', onPress }: Props) {
  const full = variant === 'full';
  const th = themeFor(id.vcType);
  const height = Math.round(width * 1.5);
  const a = id as any;
  const name = (a.name as string) ?? '';
  const rrn = full ? a.ihidNum ?? '' : maskRrn(a.ihidNum);
  const fields = buildFields(id, full);
  const statusOk = id.vcStatus === VcStatus.NORMAL;
  const photoW = Math.round(width * 0.3);
  const photoH = Math.round(photoW * 1.28);

  const Card = (
    <LinearGradient colors={th.bg} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.card, { width, height }]}>
      <GuillochePattern width={width} height={height} color={th.accent} opacity={0.5} />

      {/* 헤더 */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.country, { color: th.accent }]}>대한민국 · KOREA</Text>
          <Text style={[styles.type, { color: th.ink }]}>{vcTypeName(id.vcType)}</Text>
        </View>
        <Taegeuk size={34} />
      </View>

      {/* 사진 + 성명/주민번호 */}
      <View style={styles.identity}>
        <View style={[styles.photo, { width: photoW, height: photoH, backgroundColor: th.photoBg, borderColor: th.accent }]}>
          <PortraitSilhouette width={photoW} height={photoH} tint={th.accent} />
        </View>
        <View style={styles.idText}>
          <Text style={[styles.name, { color: th.ink }]} numberOfLines={1}>{name}</Text>
          {!!rrn && <Text style={[styles.rrn, { color: th.ink }]} numberOfLines={1}>{rrn}</Text>}
          <View style={[styles.holo, { borderColor: th.accent }]}>
            <HologramChip size={Math.round(width * 0.14)} />
          </View>
        </View>
      </View>

      {/* 필드 */}
      <View style={styles.fields}>
        {fields.map((f) => (
          <View key={f.label} style={styles.fieldRow}>
            <Text style={[styles.fieldLabel, { color: th.sub }]}>{f.label}</Text>
            <Text style={[styles.fieldValue, { color: th.ink }]} numberOfLines={full ? 2 : 1}>
              {f.value}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.spacer} />

      {/* 발급기관 */}
      <Text style={[styles.issuer, { color: th.ink }]}>{issuerName(id)}</Text>

      {/* 푸터 */}
      <View style={styles.footer}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <Text style={[styles.validity, { color: th.sub }]}>유효기간 ~ {id.vcExpirationDate}</Text>
      </View>

      {!full && (
        <View style={styles.tapHintWrap}>
          <View style={[styles.tapHint, { backgroundColor: th.accent }]}>
            <Text style={styles.tapHintText}>터치하여 상세정보 보기</Text>
          </View>
        </View>
      )}

      {!statusOk && (
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{VC_STATUS_LABEL[id.vcStatus]}</Text>
        </View>
      )}
    </LinearGradient>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [pressed && { opacity: 0.96 }]}>
        {Card}
      </Pressable>
    );
  }
  return Card;
}

function PortraitSilhouette({ width, height, tint }: { width: number; height: number; tint: string }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 100 128">
      <Rect x={0} y={0} width={100} height={128} rx={4} fill="#FFFFFF" opacity={0.5} />
      <Circle cx={50} cy={44} r={22} fill={tint} opacity={0.35} />
      <Path d="M14,120 C14,88 30,74 50,74 C70,74 86,88 86,120 Z" fill={tint} opacity={0.35} />
    </Svg>
  );
}

function HologramChip({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Defs>
        <SvgGrad id="holo" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#B7F5E4" />
          <Stop offset="40%" stopColor="#CDB7F5" />
          <Stop offset="100%" stopColor="#F5D9B7" />
        </SvgGrad>
      </Defs>
      <Rect x={2} y={2} width={36} height={36} rx={6} fill="url(#holo)" opacity={0.85} />
      <Circle cx={20} cy={20} r={9} fill="#FFFFFF" opacity={0.4} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(11,44,99,0.10)',
    shadowColor: '#0B2C63',
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  country: { fontFamily: fonts.semibold, fontSize: 11, letterSpacing: 0.5 },
  type: { fontFamily: fonts.bold, fontSize: 21, marginTop: 3 },
  identity: { flexDirection: 'row', gap: 14, marginTop: 18 },
  photo: { borderRadius: 6, borderWidth: 1, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  idText: { flex: 1, justifyContent: 'center' },
  name: { fontFamily: fonts.bold, fontSize: 24 },
  rrn: { fontFamily: fonts.bold, fontSize: 18, marginTop: 6, letterSpacing: 0.5 },
  holo: { marginTop: 12, alignSelf: 'flex-start' },
  fields: { marginTop: 18, gap: 9 },
  fieldRow: { flexDirection: 'row', alignItems: 'flex-start' },
  fieldLabel: { fontFamily: fonts.semibold, fontSize: 12, width: 62 },
  fieldValue: { fontFamily: fonts.regular, fontSize: 13, flex: 1 },
  spacer: { flex: 1, minHeight: 12 },
  issuer: { fontFamily: fonts.bold, fontSize: 16, textAlign: 'right' },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  logo: { width: 30, height: 30 },
  validity: { fontFamily: fonts.regular, fontSize: 11 },
  tapHintWrap: { alignItems: 'center', marginTop: 10 },
  statusBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: colors.danger,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  statusText: { color: '#fff', fontFamily: fonts.semibold, fontSize: 11 },
  tapHint: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    opacity: 0.92,
  },
  tapHintText: { color: '#fff', fontFamily: fonts.semibold, fontSize: 12 },
});
