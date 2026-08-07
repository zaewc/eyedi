import { DefaultTheme, Theme } from '@react-navigation/native';

export const colors = {
  primary: '#246BEB', // v1 @color/primary
  primaryDark: '#1B54C0',
  primaryLight: '#00A1ED',
  accent: '#00A1ED',

  ciRed: '#D0343A',
  ciNavy: '#0C1B2A',
  ciBlue: '#0B4DA2',

  background: '#FFFFFF',
  surface: '#F5F7FA',
  surfaceAlt: '#EDF1F7',

  text: '#1A1A1A',
  textSecondary: '#5A6472',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',
  navyText: '#0B2C63',

  border: '#E5E9F0',
  divider: '#EEF1F5',

  success: '#00A05A',
  warning: '#FF8A00',
  danger: '#E02D3C',
  info: '#0B4DA2',

  cardDriver: ['#F3F8FE', '#DCEBFC'],
  cardResident: ['#FBF7F1', '#F3E9DB'],
  cardForeign: ['#F1F3FB', '#E3E6F5'],
  cardMerit: ['#F7F1F1', '#EFE0DF'],
  cardDefault: ['#F5F7FA', '#E8ECF2'],

  overlay: 'rgba(0,0,0,0.5)',
  transparent: 'transparent',
} as const;

export const cardText: Record<string, string> = {
  mdriverlic: '#0B2C63',
  identitycard: '#6B4A22',
  rsdcard: '#6B4A22',
  prmntrsdcard: '#33306B',
  ovkorrsdcard: '#33306B',
  nationmerit: '#7A3B2E',
  indepatriot: '#7A3B2E',
};

export const navTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.background,
    text: colors.text,
    border: colors.border,
    notification: colors.danger,
  },
};
