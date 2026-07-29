import { DefaultTheme, Theme } from '@react-navigation/native';

export const colors = {

  primary: '#1A5CFF',
  primaryDark: '#0B3FB5',
  primaryLight: '#4C82FF',

  background: '#FFFFFF',
  surface: '#F5F7FB',
  surfaceAlt: '#EEF2F8',

  text: '#1A1A1A',
  textSecondary: '#5A6472',
  textTertiary: '#98A2B3',
  textInverse: '#FFFFFF',

  border: '#E2E8F0',
  divider: '#EDF0F5',

  success: '#00A86B',
  warning: '#FF8A00',
  danger: '#E63946',
  info: '#1A5CFF',

  cardDriver: ['#1A5CFF', '#0B3FB5'],
  cardResident: ['#2FB4A6', '#0F8C80'],
  cardForeign: ['#7B61FF', '#4A32C4'],
  cardMerit: ['#E8763A', '#C4531B'],
  cardDefault: ['#5A6472', '#374151'],

  overlay: 'rgba(0,0,0,0.5)',
  transparent: 'transparent',
} as const;

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
