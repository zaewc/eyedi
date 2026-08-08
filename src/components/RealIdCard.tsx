import React from 'react';
import { Image, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors, fonts } from '@/theme';
import { MobileId, vcTypeName, VcStatus, VC_STATUS_LABEL } from '@/types';

const logo = require('../../assets/img/logo.png');
const mrcLogo = require('../../assets/img/cards/mrc_logo.png');
const fingerBg = require('../../assets/img/cards/finger_bg.png');
const mdlSeal = require('../../assets/img/cards/seal_mdl.jpg');

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

const CARD_W = 355;
const CARD_H = 217;
const CARD_RATIO = CARD_W / CARD_H;
const INK = '#000000';

function maskRrnPost(): string {
  return '******';
}

function issuerName(id: MobileId): string {
  const a = id as any;
  return a.issuerName ?? a.issuernm ?? a.engissuernm ?? '';
}

function PortraitSilhouette({ w, h }: { w: number; h: number }) {
  return (
    <Svg width={w} height={h} viewBox="0 0 100 128">
      <Rect x={0} y={0} width={100} height={128} rx={3} fill="#EDEFF2" />
      <Circle cx={50} cy={46} r={22} fill="#C2C8D0" />
      <Path d="M14,122 C14,90 30,76 50,76 C70,76 86,90 86,122 Z" fill="#C2C8D0" />
    </Svg>
  );
}

/** 주민등록증 전용 얼굴 — v1 main_mrc_detail.xml 재현 */
function ResidentFace({ id, s, full }: { id: MobileId; s: number; full: boolean }) {
  const a = id as any;
  const name = (a.name as string) ?? '';
  const rrnDigits = (a.ihidNum ?? '').replace(/[^0-9]/g, '');
  const birthPrev = rrnDigits.slice(0, 6);
  const birthG = rrnDigits.slice(6, 7) || '';
  const post = full ? rrnDigits.slice(6) : `${birthG}${maskRrnPost()}`;
  const foreign = a.foreignflag === 'Y';

  return (
    <View style={{ flex: 1, paddingTop: 15 * s, paddingLeft: 20 * s, paddingRight: 20 * s, paddingBottom: 10 * s }}>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        {/* 좌: 로고/제목/이름/주민번호/주소 */}
        <View style={{ flex: 1, paddingRight: 25 * s }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={mrcLogo} style={{ width: 30 * s, height: 30 * s }} resizeMode="contain" />
            <Text style={{ fontFamily: fonts.bold, fontSize: 22.1 * s, color: INK, letterSpacing: 22.1 * s * 0.08, marginLeft: 6 * s }}>
              주민등록증
            </Text>
            {foreign && (
              <Text style={{ fontFamily: fonts.regular, fontSize: 12 * s, color: INK, marginLeft: 4 * s, marginTop: 10 * s }}>(재외국민)</Text>
            )}
          </View>

          <Text numberOfLines={1} style={{ fontFamily: fonts.semibold, fontSize: 17.3 * s, color: INK, letterSpacing: 17.3 * s * 0.08, marginTop: 10 * s }}>
            {name}
          </Text>

          <View style={{ flexDirection: 'row', marginTop: 3 * s }}>
            <Text style={{ fontFamily: fonts.semibold, fontSize: 15.4 * s, color: INK, letterSpacing: 15.4 * s * 0.075 }}>
              {birthPrev}
            </Text>
            <Text style={{ fontFamily: fonts.bold, fontSize: 15.4 * s, color: INK }}>-</Text>
            <Text style={{ fontFamily: fonts.semibold, fontSize: 15.4 * s, color: INK, letterSpacing: 15.4 * s * 0.07 }}>
              {post}
            </Text>
          </View>

          {!!a.address && (
            <Text numberOfLines={4} style={{ fontFamily: fonts.regular, fontSize: 12.5 * s, color: INK, marginTop: 6 * s, lineHeight: 16 * s }}>
              {a.address}
            </Text>
          )}
        </View>

        {/* 우: 사진 */}
        <View style={{ width: 105 * s, marginTop: 5 * s }}>
          <View style={{ width: 105 * s, height: 134 * s, overflow: 'hidden', borderRadius: 2 * s }}>
            <PortraitSilhouette w={105 * s} h={134 * s} />
          </View>
        </View>
      </View>

      {/* 하단: 지문 · 발급일/구청장 · 직인 */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <Image source={fingerBg} style={{ width: 25 * s, height: 19 * s, opacity: 0.5 }} resizeMode="contain" />
        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
          <View style={{ alignItems: 'flex-end', marginRight: 5 * s }}>
            <Text style={{ fontFamily: fonts.regular, fontSize: 12.5 * s, color: INK }}>{id.vcIssuanceDate}</Text>
            <Text style={{ fontFamily: fonts.semibold, fontSize: 14.4 * s, color: INK }}>{issuerName(id)}</Text>
          </View>
          <Image source={SEAL.identitycard} style={{ width: 40 * s, height: 40 * s }} resizeMode="contain" />
        </View>
      </View>
    </View>
  );
}

/** 자동차운전면허증 전용 얼굴 — v1 main_mdl_detail.xml 재현 */
function DriverFace({ id, s, full }: { id: MobileId; s: number; full: boolean }) {
  const a = id as any;
  const ink = '#3F434F';
  const name = (a.name as string) ?? '';
  const rrnDigits = (a.ihidNum ?? '').replace(/[^0-9]/g, '');
  const birthPrev = rrnDigits.slice(0, 6);
  const post = full ? rrnDigits.slice(6) : `${rrnDigits.slice(6, 7)}******`;

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        {/* 좌: 종별 설명 + 사진 */}
        <View style={{ width: 110 * s, marginLeft: 15 * s, paddingTop: 7 * s, paddingBottom: 7 * s }}>
          <Text style={{ fontFamily: fonts.regular, fontSize: 8.6 * s, color: ink, lineHeight: 11 * s }} numberOfLines={3}>
            {a.asort || ''}
          </Text>
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <View style={{ width: 100 * s, height: 140 * s, overflow: 'hidden', borderRadius: 2 * s }}>
              <PortraitSilhouette w={100 * s} h={140 * s} />
            </View>
          </View>
        </View>

        {/* 우: 제목/면허번호/성명/주민번호/주소/적성검사 */}
        <View style={{ flex: 1, paddingLeft: 20 * s, paddingTop: 7 * s, paddingRight: 12 * s }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={{ fontFamily: fonts.bold, fontSize: 15.4 * s, color: ink }}>자동차운전면허증</Text>
            <Text style={{ fontFamily: fonts.regular, fontSize: 9.6 * s, color: ink, marginLeft: 4 * s }}>(Driver's License)</Text>
          </View>
          {!!a.dlNo && <Text style={{ fontFamily: fonts.bold, fontSize: 15.4 * s, color: ink, marginTop: 2 * s }}>{a.dlNo}</Text>}

          <View style={{ flex: 1, marginTop: 3 * s }}>
            <Text numberOfLines={1} style={{ fontFamily: fonts.bold, fontSize: 15.4 * s, color: ink }}>{name}</Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontFamily: fonts.bold, fontSize: 15.4 * s, color: ink }}>{birthPrev}-{post}</Text>
            </View>
            {!!a.address && (
              <Text numberOfLines={3} style={{ fontFamily: fonts.regular, fontSize: 10.6 * s, color: ink, marginTop: 3 * s, lineHeight: 13 * s }}>
                {a.address}
              </Text>
            )}
            <View style={{ marginTop: 'auto' }}>
              {!!a.aptdInspectBegin && (
                <Text style={{ fontFamily: fonts.regular, fontSize: 10.6 * s, color: ink }}>
                  적성검사 {a.aptdInspectBegin} ~ {a.aptdInspectEnd}
                </Text>
              )}
              {!!a.conditionCode && (
                <Text style={{ fontFamily: fonts.regular, fontSize: 10.6 * s, color: ink }}>조건 {a.conditionCode}</Text>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* 하단: 장기기증 · 발급일/발급기관 · 직인 */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginLeft: 18 * s, marginRight: 17 * s, marginBottom: 8 * s }}>
        <Text style={{ fontFamily: fonts.regular, fontSize: 8.6 * s, color: ink }}>
          {a.organDonation ? '장기기증 희망' : ''}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
          <Text style={{ fontFamily: fonts.regular, fontSize: 9.6 * s, color: ink, marginRight: 8 * s }}>{id.vcIssuanceDate}</Text>
          <Text style={{ fontFamily: fonts.bold, fontSize: 13.4 * s, color: ink, marginRight: 6 * s }}>{issuerName(id)}</Text>
          <Image source={mdlSeal} style={{ width: 30 * s, height: 30 * s, borderRadius: 15 * s, opacity: 0.9 }} resizeMode="contain" />
        </View>
      </View>
    </View>
  );
}

/** 그 외 신분증 일반 얼굴 */
function GenericFace({ id, s, full }: { id: MobileId; s: number; full: boolean }) {
  const a = id as any;
  const name = (a.name as string) ?? '';
  const rrnDigits = (a.ihidNum ?? '').replace(/[^0-9]/g, '');
  const rrn = full ? a.ihidNum ?? '' : rrnDigits.length >= 7 ? `${rrnDigits.slice(0, 6)}-${rrnDigits.slice(6, 7)}******` : a.ihidNum ?? '';
  const seal = SEAL[id.vcType];
  const extra: { label: string; value: string }[] = [];
  if (id.vcType === 'mdriverlic') {
    if (a.dlNo) extra.push({ label: '면허번호', value: a.dlNo });
    if (a.asort) extra.push({ label: '종별', value: a.asort });
    if (a.aptdInspectEnd) extra.push({ label: '적성검사', value: `~ ${a.aptdInspectEnd}` });
  }
  if (a.address) extra.push({ label: '주소', value: a.address });

  return (
    <View style={{ flex: 1, padding: 15 * s, justifyContent: 'space-between' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image source={logo} style={{ width: 24 * s, height: 24 * s, marginRight: 6 * s }} resizeMode="contain" />
        <Text style={{ fontFamily: fonts.bold, fontSize: 18 * s, color: '#3F434F' }}>{vcTypeName(id.vcType)}</Text>
      </View>
      <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', gap: 12 * s }}>
        <View style={{ width: 96 * s, height: 122 * s, overflow: 'hidden', borderRadius: 3 * s }}>
          <PortraitSilhouette w={96 * s} h={122 * s} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: fonts.bold, fontSize: 20 * s, color: '#3F434F' }} numberOfLines={1}>{name}</Text>
          {!!rrn && <Text style={{ fontFamily: fonts.bold, fontSize: 15 * s, color: '#3F434F', marginTop: 2 * s }}>{rrn}</Text>}
          {extra.slice(0, full ? extra.length : 2).map((f) => (
            <View key={f.label} style={{ flexDirection: 'row', marginTop: 4 * s }}>
              <Text style={{ fontFamily: fonts.semibold, fontSize: 11 * s, color: '#3F434F', width: 52 * s, opacity: 0.75 }}>{f.label}</Text>
              <Text style={{ fontFamily: fonts.regular, fontSize: 11.5 * s, color: '#3F434F', flex: 1 }} numberOfLines={1}>{f.value}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <View>
          <Text style={{ fontFamily: fonts.bold, fontSize: 14 * s, color: '#3F434F' }}>{issuerName(id)}</Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 10 * s, color: '#3F434F', opacity: 0.7, marginTop: 2 }}>
            {id.vcIssuanceDate} · 유효기간 ~ {id.vcExpirationDate}
          </Text>
        </View>
        {seal && <Image source={seal} style={{ width: 40 * s, height: 40 * s }} resizeMode="contain" />}
      </View>
    </View>
  );
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
  const s = width / CARD_W;
  const bg = BG[id.vcType] ?? null;
  const statusOk = id.vcStatus === VcStatus.NORMAL;
  const face =
    id.vcType === 'identitycard' ? (
      <ResidentFace id={id} s={s} full={full} />
    ) : id.vcType === 'mdriverlic' ? (
      <DriverFace id={id} s={s} full={full} />
    ) : (
      <GenericFace id={id} s={s} full={full} />
    );

  const cardStyle = [styles.card, { width, height }];
  const Card = bg ? (
    <ImageBackground source={bg} resizeMode="cover" style={cardStyle} imageStyle={styles.bgImage}>
      {face}
      {!statusOk && (
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{VC_STATUS_LABEL[id.vcStatus]}</Text>
        </View>
      )}
    </ImageBackground>
  ) : (
    <LinearGradient colors={['#F6F8FB', '#E7ECF3']} style={cardStyle}>
      {face}
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

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    backgroundColor: '#FFFFFF',
    shadowColor: '#0B2C63',
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  bgImage: { borderRadius: 16 },
  statusBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.danger,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  statusText: { color: '#fff', fontFamily: fonts.semibold, fontSize: 11 },
});
