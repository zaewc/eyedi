import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { Button, Screen } from '@/components/common';
import IdCard from '@/components/IdCard';
import { colors, spacing, typography } from '@/theme';
import { useWalletStore } from '@/data/store/walletStore';

type Nav = NativeStackNavigationProp<RootStackParamList, 'IssueComplete'>;
type Rt = RouteProp<RootStackParamList, 'IssueComplete'>;

export default function IssueCompleteScreen() {
  const navigation = useNavigation<Nav>();
  const { vcId } = useRoute<Rt>().params;
  const id = useWalletStore((s) => s.getId(vcId));

  return (
    <Screen>
      <View style={styles.body}>
        <Text style={styles.check}>✅</Text>
        <Text style={styles.title}>발급이 완료되었습니다</Text>
        <Text style={styles.desc}>이제 모바일 신분증을 사용할 수 있습니다.</Text>
        {id && (
          <View style={styles.cardWrap}>
            <IdCard id={id} />
          </View>
        )}
      </View>
      <View style={styles.footer}>
        <Button
          title="확인"
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Main' }] })}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  check: { fontSize: 64, marginBottom: spacing.lg },
  title: { ...typography.h2, marginBottom: spacing.sm },
  desc: { ...typography.bodySecondary, marginBottom: spacing.xl },
  cardWrap: { alignSelf: 'stretch' },
  footer: { padding: spacing.lg },
});
