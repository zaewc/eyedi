import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { colors, typography } from '@/theme';
import { useAuthStore } from '@/data/store/authStore';
import { useWalletStore } from '@/data/store/walletStore';
import { AppHttpService } from '@/data/services/httpService';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

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
    <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.root}>
      <View style={styles.center}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>MID</Text>
        </View>
        <Text style={styles.title}>모바일 신분증</Text>
        <Text style={styles.subtitle}>대한민국 정부</Text>
      </View>
      <ActivityIndicator color={colors.textInverse} style={styles.loader} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  center: { alignItems: 'center' },
  logo: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  logoText: { color: colors.textInverse, fontSize: 30, fontWeight: '800', letterSpacing: 1 },
  title: { ...typography.h1, color: colors.textInverse },
  subtitle: { ...typography.body, color: 'rgba(255,255,255,0.8)', marginTop: 6 },
  loader: { position: 'absolute', bottom: 64 },
});
