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
  Apply: undefined;
  Menu: undefined;

  IdDetail: { vcId: string };

  IssueConfirm: { vcType: string };
  IssueLoading: { vcType: string };
  IssueComplete: { vcId: string };

  PresentQR: { vcId: string };
  ScanQR: undefined;
  VerifyConfirm: { profile: VerifyProfile; vcId: string };
  VerifyComplete: {
    verifier: string;
    purpose: string;
    name: string;
    photo: boolean;
    disclosed: { label: string; value: string }[];
  };

  Settings: undefined;
  UsageHistory: undefined;
  ServiceCenter: undefined;
  LossReport: undefined;

  Notice: undefined;
  Web: { url: string; title?: string };
};
