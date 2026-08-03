import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { Button } from '@/components/common';
import { colors, spacing, typography } from '@/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'VerifyComplete'>;
type Rt = RouteProp<RootStackParamList, 'VerifyComplete'>;

export default function VerifyCompleteScreen() {
  const navigation = useNavigation<Nav>();
  const { verifier } = useRoute<Rt>().params;

  return (
    <LinearGradient colors={[colors.success, '#00875A']} style={styles.root}>
      <View style={styles.body}>
        <Text style={styles.check}>✓</Text>
        <Text style={styles.title}>신원 확인 완료</Text>
        <Text style={styles.desc}>{verifier}에 신원 정보가{'\n'}안전하게 제공되었습니다.</Text>
      </View>
      <View style={styles.footer}>
        <Button
          title="확인"
          variant="secondary"
          style={styles.btn}
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Main' }] })}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'space-between' },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  check: {
    fontSize: 60,
    color: colors.success,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.textInverse,
    textAlign: 'center',
    lineHeight: 110,
    overflow: 'hidden',
    marginBottom: spacing.xl,
  },
  title: { ...typography.h1, color: colors.textInverse, marginBottom: spacing.md },
  desc: { ...typography.body, color: 'rgba(255,255,255,0.9)', textAlign: 'center' },
  footer: { padding: spacing.lg },
  btn: { backgroundColor: colors.textInverse },
});
