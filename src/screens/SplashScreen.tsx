import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { colors, fonts, spacing } from '@/theme';
import { useAuthStore } from '@/data/store/authStore';
import { useWalletStore } from '@/data/store/walletStore';
import { AppHttpService } from '@/data/services/httpService';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

const logo = require('../../assets/img/logo.png');
const wave = require('../../assets/img/wave.png');

export default function SplashScreen() {
  const navigation = useNavigation<Nav>();
  const hydrateAuth = useAuthStore((s) => s.hydrate);
  const hydrateWallet = useWalletStore((s) => s.hydrate);

  useEffect(() => {
    (async () => {
      await AppHttpService.getVersion();
      await Promise.all([hydrateAuth(), hydrateWallet()]);
      const { onboarded, hasPin } = useAuthStore.getState();
      await new Promise((r) => setTimeout(r, 900));
      if (!onboarded || !hasPin) {
        navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'Lock' }] });
      }
    })();
  }, []);

  return (
    <View style={styles.root}>
      <View style={styles.center}>
        <View style={styles.brandRow}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>모바일 신분증</Text>
        </View>
      </View>
      <ActivityIndicator color={colors.primary} style={styles.loader} />
      <Image source={wave} style={styles.wave} resizeMode="stretch" />
      <Text style={styles.gov}>행정안전부</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  center: { alignItems: 'center' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logo: { width: 30, height: 27 },
  title: { fontFamily: fonts.semibold, fontSize: 22, color: '#000000' },
  loader: { position: 'absolute', bottom: 150 },
  wave: { position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%', height: 120 },
  gov: { position: 'absolute', bottom: 40, fontFamily: fonts.semibold, fontSize: 13, color: '#6E86A8' },
});
