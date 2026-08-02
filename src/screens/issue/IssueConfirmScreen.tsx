import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { Button, Header, Screen, Dialog } from '@/components/common';
import { colors, radius, spacing, typography } from '@/theme';
import { vcTypeName } from '@/types';
import { mockIssuableVcs } from '@/data/mock/mockData';

type Nav = NativeStackNavigationProp<RootStackParamList, 'IssueConfirm'>;
type Rt = RouteProp<RootStackParamList, 'IssueConfirm'>;

export default function IssueConfirmScreen() {
  const navigation = useNavigation<Nav>();
  const { vcType } = useRoute<Rt>().params;
  const info = mockIssuableVcs.find((v) => v.vcType === vcType);
  const [agreed, setAgreed] = useState(false);
  const [showAgree, setShowAgree] = useState(false);

  return (
    <Screen>
      <Header title="신분증 발급" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.hero}>
          <Text style={styles.heroIcon}>🪪</Text>
          <Text style={styles.title}>{vcTypeName(vcType)}</Text>
          <Text style={styles.issuer}>{info?.issuer} 발급</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>발급 안내</Text>
          <Bullet text="본인 명의 기기에서만 발급할 수 있습니다." />
          <Bullet text="발급 과정에서 본인확인이 필요합니다." />
          <Bullet text="발급된 신분증은 이 기기에 안전하게 저장됩니다." />
          <Bullet text="타인에게 양도·대여할 수 없습니다." />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>수집·이용 정보</Text>
          <Text style={styles.infoText}>성명, 생년월일, 주소, 사진, 발급기관 정보 등</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={agreed ? '발급받기' : '동의하고 발급받기'}
          onPress={() => {
            if (!agreed) {
              setShowAgree(true);
            } else {
              navigation.replace('IssueLoading', { vcType });
            }
          }}
        />
      </View>

      <Dialog
        visible={showAgree}
        title="개인정보 수집·이용 동의"
        message="모바일 신분증 발급을 위해 개인정보 수집·이용에 동의합니다."
        cancelText="취소"
        confirmText="동의"
        onCancel={() => setShowAgree(false)}
        onConfirm={() => {
          setShowAgree(false);
          setAgreed(true);
          navigation.replace('IssueLoading', { vcType });
        }}
      />
    </Screen>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <View style={styles.bullet}>
      <Text style={styles.dot}>•</Text>
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg, gap: spacing.lg },
  hero: { alignItems: 'center', paddingVertical: spacing.lg },
  heroIcon: { fontSize: 56, marginBottom: spacing.md },
  title: { ...typography.h2 },
  issuer: { ...typography.bodySecondary, marginTop: 4 },
  card: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md },
  cardTitle: { ...typography.title, marginBottom: spacing.sm },
  bullet: { flexDirection: 'row', gap: spacing.sm, marginBottom: 6 },
  dot: { color: colors.primary },
  bulletText: { ...typography.bodySecondary, flex: 1 },
  infoText: { ...typography.bodySecondary },
  footer: { padding: spacing.lg },
});
