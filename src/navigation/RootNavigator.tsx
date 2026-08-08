import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

import SplashScreen from '@/screens/SplashScreen';
import OnboardingScreen from '@/screens/onboard/OnboardingScreen';
import TermsScreen from '@/screens/onboard/TermsScreen';
import PhoneAuthScreen from '@/screens/auth/PhoneAuthScreen';
import SetPinScreen from '@/screens/password/SetPinScreen';
import BiometricSetupScreen from '@/screens/auth/BiometricSetupScreen';
import LockScreen from '@/screens/password/LockScreen';
import HomeScreen from '@/screens/main/HomeScreen';
import ApplyScreen from '@/screens/main/ApplyScreen';
import MenuScreen from '@/screens/menu/MenuScreen';
import IdDetailScreen from '@/screens/menu/IdDetailScreen';
import IssueConfirmScreen from '@/screens/issue/IssueConfirmScreen';
import IssueLoadingScreen from '@/screens/issue/IssueLoadingScreen';
import IssueCompleteScreen from '@/screens/issue/IssueCompleteScreen';
import PresentQRScreen from '@/screens/verify/PresentQRScreen';
import ScanQRScreen from '@/screens/verify/ScanQRScreen';
import VerifyConfirmScreen from '@/screens/verify/VerifyConfirmScreen';
import VerifyCompleteScreen from '@/screens/verify/VerifyCompleteScreen';
import SettingsScreen from '@/screens/menu/SettingsScreen';
import UsageHistoryScreen from '@/screens/menu/UsageHistoryScreen';
import ServiceCenterScreen from '@/screens/menu/ServiceCenterScreen';
import LossReportScreen from '@/screens/menu/LossReportScreen';
import NoticeScreen from '@/screens/menu/NoticeScreen';
import WebScreen from '@/screens/web/WebScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />

      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Terms" component={TermsScreen} />
      <Stack.Screen name="PhoneAuth" component={PhoneAuthScreen} />
      <Stack.Screen name="SetPin" component={SetPinScreen} />
      <Stack.Screen name="BiometricSetup" component={BiometricSetupScreen} />

      <Stack.Screen name="Lock" component={LockScreen} options={{ gestureEnabled: false }} />

      <Stack.Screen name="Main" component={HomeScreen} options={{ gestureEnabled: false }} />
      <Stack.Screen name="Apply" component={ApplyScreen} />
      <Stack.Screen name="Menu" component={MenuScreen} />
      <Stack.Screen
        name="IdDetail"
        component={IdDetailScreen}
        options={{ presentation: 'transparentModal', animation: 'fade', animationDuration: 250 }}
      />

      <Stack.Screen name="IssueConfirm" component={IssueConfirmScreen} />
      <Stack.Screen
        name="IssueLoading"
        component={IssueLoadingScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen name="IssueComplete" component={IssueCompleteScreen} />

      <Stack.Screen name="PresentQR" component={PresentQRScreen} />
      <Stack.Screen name="ScanQR" component={ScanQRScreen} />
      <Stack.Screen name="VerifyConfirm" component={VerifyConfirmScreen} />
      <Stack.Screen name="VerifyComplete" component={VerifyCompleteScreen} />

      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="UsageHistory" component={UsageHistoryScreen} />
      <Stack.Screen name="ServiceCenter" component={ServiceCenterScreen} />
      <Stack.Screen name="LossReport" component={LossReportScreen} />
      <Stack.Screen name="Notice" component={NoticeScreen} />
      <Stack.Screen name="Web" component={WebScreen} />
    </Stack.Navigator>
  );
}
