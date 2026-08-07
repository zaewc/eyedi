import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import { colors, fonts } from '@/theme';
import WalletScreen from '@/screens/main/WalletScreen';
import ApplyScreen from '@/screens/main/ApplyScreen';
import MenuScreen from '@/screens/menu/MenuScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabelStyle: { fontSize: 12, fontFamily: fonts.semibold },
        tabBarStyle: { borderTopColor: colors.divider, height: 62, paddingBottom: 8, paddingTop: 6 },
      }}
    >
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{ title: '신분증', tabBarIcon: ({ color }) => <TabIcon char="🪪" color={color} /> }}
      />
      <Tab.Screen
        name="Apply"
        component={ApplyScreen}
        options={{ title: '발급', tabBarIcon: ({ color }) => <TabIcon char="＋" color={color} /> }}
      />
      <Tab.Screen
        name="Menu"
        component={MenuScreen}
        options={{ title: '전체', tabBarIcon: ({ color }) => <TabIcon char="≡" color={color} /> }}
      />
    </Tab.Navigator>
  );
}

function TabIcon({ char, color }: { char: string; color: string }) {
  return <Text style={[styles.icon, { color }]}>{char}</Text>;
}

const styles = StyleSheet.create({
  icon: { fontSize: 20 },
});
