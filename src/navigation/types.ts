import { VerifyProfile } from '@/types';

export type RootStackParamList = {
  Splash: undefined;

  Onboarding: undefined;
  Terms: undefined;
  PhoneAuth: undefined;
  SetPin: { mode: 'create' | 'change' };
  BiometricSetup: undefined;

  Lock: undefined;

  Main: undefined;

  IdDetail: { vcId: string };

  IssueConfirm: { vcType: string };
  IssueLoading: { vcType: string };
  IssueComplete: { vcId: string };

  PresentQR: { vcId: string };
  ScanQR: undefined;
  VerifyConfirm: { profile: VerifyProfile; vcId: string };
  VerifyComplete: { verifier: string };

  Settings: undefined;
  UsageHistory: undefined;
  ServiceCenter: undefined;
  LossReport: undefined;

  Notice: undefined;
  Web: { url: string; title?: string };
};

export type MainTabParamList = {
  Wallet: undefined;
  Apply: undefined;
  Menu: undefined;
};
