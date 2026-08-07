import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '@/navigation/types';
import { Header, Button } from '@/components/common';
import RealIdCard from '@/components/RealIdCard';
import { colors, fonts, spacing } from '@/theme';
import { useWalletStore } from '@/data/store/walletStore';

type Nav = NativeStackNavigationProp<RootStackParamList, 'IdDetail'>;
type Rt = RouteProp<RootStackParamList, 'IdDetail'>;

const { width } = Dimensions.get('window');

export default function IdDetailScreen() {
  const navigation = useNavigation<Nav>();
  const { vcId } = useRoute<Rt>().params;
  const id = useWalletStore((s) => s.getId(vcId));

  if (!id) {
    return (
      <View style={styles.root}>
        <Header title="신분증" onBack={() => navigation.goBack()} light />
        <View style={styles.empty}>
          <Text style={styles.emptyText}>신분증 정보를 찾을 수 없습니다.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <LinearGradient colors={[colors.primaryDark, colors.primary]} style={StyleSheet.absoluteFill} />
      <Header title="신분증" onBack={() => navigation.goBack()} light />
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <RealIdCard id={id} width={width - spacing.lg * 2} variant="full" />
        <Text style={styles.note}>실물 신분증과 동일한 효력을 가집니다.</Text>
      </ScrollView>
      <View style={styles.footer}>
        <Button title="QR로 제시하기" onPress={() => navigation.navigate('PresentQR', { vcId: id.vcId })} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primaryDark },
  body: { padding: spacing.lg, alignItems: 'center' },
  note: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    marginTop: spacing.lg,
  },
  footer: { padding: spacing.lg },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontFamily: fonts.regular, color: colors.textInverse },
});
