import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { Button, Header, Screen, Dialog } from '@/components/common';
import { colors, radius, spacing, typography } from '@/theme';
import { useWalletStore } from '@/data/store/walletStore';
import { vcTypeName } from '@/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'LossReport'>;

export default function LossReportScreen() {
  const navigation = useNavigation<Nav>();
  const ids = useWalletStore((s) => s.ids);
  const [selected, setSelected] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [done, setDone] = useState(false);

  const report = () => {

    setConfirm(false);
    setDone(true);
  };

  return (
    <Screen background={colors.surface}>
      <Header title="분실 신고" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.desc}>
          분실 신고 시 해당 신분증은 즉시 사용 정지되며,{'\n'}재발급 전까지 제시할 수 없습니다.
        </Text>
        {ids.length === 0 ? (
          <Text style={typography.bodySecondary}>등록된 신분증이 없습니다.</Text>
        ) : (
          ids.map((id) => (
            <Pressable
              key={id.vcId}
              style={[styles.item, selected === id.vcId && styles.itemOn]}
              onPress={() => setSelected(id.vcId)}
            >
              <Text style={styles.itemTitle}>{vcTypeName(id.vcType)}</Text>
              <View style={[styles.radio, selected === id.vcId && styles.radioOn]} />
            </Pressable>
          ))
        )}
      </ScrollView>
      <View style={styles.footer}>
        <Button
          title="분실 신고하기"
          variant="primary"
          disabled={!selected}
          onPress={() => setConfirm(true)}
          style={{ backgroundColor: colors.danger }}
        />
      </View>

      <Dialog
        visible={confirm}
        title="분실 신고"
        message="선택한 신분증을 사용 정지하시겠습니까?"
        cancelText="취소"
        confirmText="신고"
        onCancel={() => setConfirm(false)}
        onConfirm={report}
      />
      <Dialog
        visible={done}
        title="신고 완료"
        message="분실 신고가 접수되어 사용이 정지되었습니다."
        onConfirm={() => {
          setDone(false);
          navigation.goBack();
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg, gap: spacing.sm },
  desc: { ...typography.bodySecondary, marginBottom: spacing.md },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.background,
  },
  itemOn: { borderColor: colors.danger },
  itemTitle: { ...typography.title },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.border },
  radioOn: { borderColor: colors.danger, backgroundColor: colors.danger },
  footer: { padding: spacing.lg },
});
