import React from 'react';
import { Image, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors, cardText, fonts } from '@/theme';
import { MobileId, vcTypeName, VcStatus, VC_STATUS_LABEL } from '@/types';

const logo = require('../../assets/img/logo.png');
const BG_MDL = require('../../assets/img/card_bg_mdl.png');
const BG_MRC = require('../../assets/img/card_bg_mrc.png');

const CARD_RATIO = 1.585; // 실물 신분증(ISO ID-1) 가로:세로

function bgFor(vcType: string): number | null {
  switch (vcType) {
    case 'mdriverlic':
      return BG_MDL;
    case 'identitycard':
    case 'rsdcard':
    case 'nationmerit':
    case 'indepatriot':
      return BG_MRC;
    default:
      return null;
  }
}

function engTitle(vcType: string): string {
  switch (vcType) {
    case 'mdriverlic':
      return "Driver's License";
    case 'identitycard':
    case 'rsdcard':
      return 'Resident Registration';
    case 'nationmerit':
    case 'indepatriot':
      return 'National Merit';
    default:
      return 'Mobile ID';
  }
}

function maskRrn(rrn: string | undefined): string {
  if (!rrn) return '';
  const d = rrn.replace(/[^0-9]/g, '');
  if (d.length >= 7) return `${d.slice(0, 6)}-${d.slice(6, 7)}******`;
  return rrn;
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
  const height = Math.round(width / CARD_RATIO);
  const ink = cardText[id.vcType] ?? colors.navyText;
  const a = id as any;
  const name = (a.name as string) ?? '';
  const rrn = full ? a.ihidNum ?? '' : maskRrn(a.ihidNum);
  const bg = bgFor(id.vcType);
  const statusOk = id.vcStatus === VcStatus.NORMAL;

  const pad = Math.round(width * 0.05);
  const photoW = Math.round(width * 0.2);
  const photoH = Math.round(photoW * 1.28);

  const extra: { label: string; value: string }[] = [];
  if (id.vcType === 'mdriverlic') {
    if (a.dlNo) extra.push({ label: '면허번호', value: a.dlNo });
    if (a.asort) extra.push({ label: '종별', value: a.asort });
    if (a.aptdInspectEnd) extra.push({ label: '적성검사', value: `~ ${a.aptdInspectEnd}` });
  }
  if (a.address) extra.push({ label: '주소', value: a.address });
  extra.push({ label: '발급일', value: id.vcIssuanceDate });

  const Inner = (
    <View style={[styles.inner, { padding: pad }]}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.type, { color: ink }]} numberOfLines={1}>
            {vcTypeName(id.vcType)}
          </Text>
          <Text style={[styles.eng, { color: ink }]}>{engTitle(id.vcType)}</Text>
        </View>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </View>

      {/* 본문: 사진 + 정보 */}
      <View style={styles.body}>
        <View style={[styles.photo, { width: photoW, height: photoH, borderColor: ink }]}>
          <PortraitSilhouette width={photoW} height={photoH} tint={ink} />
        </View>
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: ink }]} numberOfLines={1}>{name}</Text>
            {!!rrn && <Text style={[styles.rrn, { color: ink }]} numberOfLines={1}>{rrn}</Text>}
          </View>
          {extra.slice(0, full ? extra.length : 2).map((f) => (
            <View key={f.label} style={styles.fieldRow}>
              <Text style={[styles.fieldLabel, { color: ink }]}>{f.label}</Text>
              <Text style={[styles.fieldValue, { color: ink }]} numberOfLines={1}>{f.value}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 푸터 */}
      <View style={styles.footer}>
        <Text style={[styles.validity, { color: ink }]}>유효기간 ~ {id.vcExpirationDate}</Text>
        <Text style={[styles.issuer, { color: ink }]} numberOfLines={1}>{issuerName(id)}</Text>
      </View>

      {!statusOk && (
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{VC_STATUS_LABEL[id.vcStatus]}</Text>
        </View>
      )}
    </View>
  );

  const cardStyle = [styles.card, { width, height }];

  const Card = bg ? (
    <ImageBackground source={bg} resizeMode="cover" style={cardStyle} imageStyle={styles.bgImage}>
      {Inner}
    </ImageBackground>
  ) : (
    <LinearGradient colors={['#F6F8FB', '#E7ECF3']} style={cardStyle}>
      {Inner}
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
      <Rect x={0} y={0} width={100} height={128} rx={4} fill="#FFFFFF" opacity={0.55} />
      <Circle cx={50} cy={44} r={22} fill={tint} opacity={0.28} />
      <Path d="M14,120 C14,88 30,74 50,74 C70,74 86,88 86,120 Z" fill={tint} opacity={0.28} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(11,44,99,0.12)',
    backgroundColor: '#FFFFFF',
    shadowColor: '#0B2C63',
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  bgImage: { borderRadius: 16 },
  inner: { flex: 1, justifyContent: 'space-between' },
  header: { flexDirection: 'row', alignItems: 'flex-start' },
  type: { fontFamily: fonts.bold, fontSize: 18 },
  eng: { fontFamily: fonts.regular, fontSize: 10, opacity: 0.65, marginTop: 1 },
  logo: { width: 26, height: 26 },
  body: { flexDirection: 'row', gap: 12, flex: 1, alignItems: 'center' },
  photo: {
    borderRadius: 5,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  info: { flex: 1, justifyContent: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 },
  name: { fontFamily: fonts.bold, fontSize: 20 },
  rrn: { fontFamily: fonts.bold, fontSize: 15, letterSpacing: 0.3 },
  fieldRow: { flexDirection: 'row', marginTop: 5 },
  fieldLabel: { fontFamily: fonts.semibold, fontSize: 11, width: 52, opacity: 0.75 },
  fieldValue: { fontFamily: fonts.regular, fontSize: 11.5, flex: 1 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  validity: { fontFamily: fonts.regular, fontSize: 10, opacity: 0.7 },
  issuer: { fontFamily: fonts.bold, fontSize: 14, flexShrink: 1 },
  statusBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.danger,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  statusText: { color: '#fff', fontFamily: fonts.semibold, fontSize: 11 },
});
