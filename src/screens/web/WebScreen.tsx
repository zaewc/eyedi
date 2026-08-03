import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { Header, Screen } from '@/components/common';
import { colors } from '@/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Web'>;
type Rt = RouteProp<RootStackParamList, 'Web'>;

export default function WebScreen() {
  const navigation = useNavigation<Nav>();
  const { url, title } = useRoute<Rt>().params;

  return (
    <Screen edges={false}>
      <Header title={title ?? '안내'} onBack={() => navigation.goBack()} />
      <WebView
        source={{ uri: url }}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  loader: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
});
