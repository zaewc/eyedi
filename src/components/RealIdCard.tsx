import React from 'react';
import { Image, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors, cardText, fonts } from '@/theme';
import { MobileId, vcTypeName, VcStatus, VC_STATUS_LABEL } from '@/types';

const logo = require('../../assets/img/logo.png');

const BG: Record<string, number> = {
  mdriverlic: require('../../assets/img/cards/bg_mdl.png'),
  identitycard: require('../../assets/img/cards/bg_mrc.png'),
  rsdcard: require('../../assets/img/cards/bg_mrc.png'),
  nationmerit: require('../../assets/img/cards/bg_mnh.png'),
  indepatriot: require('../../assets/img/cards/bg_mnh.png'),
  prmntrsdcard: require('../../assets/img/cards/bg_mep.png'),
  ovkorrsdcard: require('../../assets/img/cards/bg_mep.png'),
};

const SEAL: Record<string, number> = {
  identitycard: require('../../assets/img/cards/seal_mrc.png'),
  rsdcard: require('../../assets/img/cards/seal_mrc.png'),
  nationmerit: require('../../assets/img/cards/seal_mnh.png'),
  indepatriot: require('../../assets/img/cards/seal_mnh.png'),
  prmntrsdcard: require('../../assets/img/cards/seal_mep.png'),
  ovkorrsdcard: require('../../assets/img/cards/seal_mep.png'),
};

const CARD_RATIO = 1.585;

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
    case 'prmntrsdcard':
    case 'ovkorrsdcard':
      return 'Registration Card';
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
  const bg = BG[id.vcType] ?? null;
  const seal = SEAL[id.vcType] ?? null;
  const statusOk = id.vcStatus === VcStatus.NORMAL;

  const pad = Math.round(width * 0.048);
  const photoW = Math.round(width * 0.19);
  const photoH = Math.round(photoW * 1.28);
  const sealSz = Math.round(height * 0.26);

  const extra: { label: string; value: string }[] = [];
  if (id.vcType === 'mdriverlic') {
    if (a.dlNo) extra.push({ label: '면허번호', value: a.dlNo });
    if (a.asort) extra.push({ label: '종별', value: a.asort });
    if (a.aptdInspectEnd) extra.push({ label: '적성검사', value: `~ ${a.aptdInspectEnd}` });
  }
  if (a.address) extra.push({ label: '주소', value: a.address });

  const Inner = (
    <View style={[styles.inner, { padding: pad }]}>
      {/* 헤더: 로고 + 제목 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
          <View>
            <Text style={[styles.type, { color: ink }]} numberOfLines={1}>
              {vcTypeName(id.vcType)}
            </Text>
            <Text style={[styles.eng, { color: ink }]}>{engTitle(id.vcType)}</Text>
          </View>
        </View>
      </View>

      {/* 본문: 사진 + 정보 */}
      <View style={styles.body}>
        <View style={[styles.photo, { width: photoW, height: photoH, borderColor: ink }]}>
          <PortraitSilhouette width={photoW} height={photoH} tint={ink} />
        </View>
        <View style={styles.info}>
          <Text style={[styles.name, { color: ink }]} numberOfLines={1}>{name}</Text>
          {!!rrn && <Text style={[styles.rrn, { color: ink }]} numberOfLines={1}>{rrn}</Text>}
          {extra.slice(0, full ? extra.length : 2).map((f) => (
            <View key={f.label} style={styles.fieldRow}>
              <Text style={[styles.fieldLabel, { color: ink }]}>{f.label}</Text>
              <Text style={[styles.fieldValue, { color: ink }]} numberOfLines={1}>{f.value}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 푸터: 발급기관/발급일 + 인장 */}
      <View style={styles.footer}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.issuer, { color: ink }]} numberOfLines={1}>{issuerName(id)}</Text>
          <Text style={[styles.validity, { color: ink }]}>
            {id.vcIssuanceDate} · 유효기간 ~ {id.vcExpirationDate}
          </Text>
        </View>
        {seal && <Image source={seal} style={{ width: sealSz, height: sealSz }} resizeMode="contain" />}
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
      <Rect x={0} y={0} width={100} height={128} rx={4} fill="#FFFFFF" opacity={0.6} />
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  logo: { width: 24, height: 24 },
  type: { fontFamily: fonts.bold, fontSize: 17 },
  eng: { fontFamily: fonts.regular, fontSize: 9.5, opacity: 0.65, marginTop: 1 },
  body: { flexDirection: 'row', gap: 12, flex: 1, alignItems: 'center' },
  photo: { borderRadius: 5, borderWidth: 1, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  info: { flex: 1, justifyContent: 'center' },
  name: { fontFamily: fonts.bold, fontSize: 20 },
  rrn: { fontFamily: fonts.bold, fontSize: 15, letterSpacing: 0.3, marginTop: 2 },
  fieldRow: { flexDirection: 'row', marginTop: 4 },
  fieldLabel: { fontFamily: fonts.semibold, fontSize: 10.5, width: 50, opacity: 0.75 },
  fieldValue: { fontFamily: fonts.regular, fontSize: 11, flex: 1 },
  footer: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  issuer: { fontFamily: fonts.bold, fontSize: 14 },
  validity: { fontFamily: fonts.regular, fontSize: 9.5, opacity: 0.7, marginTop: 2 },
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
