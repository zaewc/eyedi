import { TextStyle } from 'react-native';
import { colors } from './colors';
import { fonts } from './fonts';

export const typography: Record<string, TextStyle> = {
  h1: { fontFamily: fonts.bold, fontSize: 26, color: colors.text, lineHeight: 34 },
  h2: { fontFamily: fonts.bold, fontSize: 22, color: colors.text, lineHeight: 30 },
  h3: { fontFamily: fonts.bold, fontSize: 18, color: colors.text, lineHeight: 26 },
  title: { fontFamily: fonts.semibold, fontSize: 16, color: colors.text, lineHeight: 24 },
  body: { fontFamily: fonts.regular, fontSize: 15, color: colors.text, lineHeight: 22 },
  bodySecondary: { fontFamily: fonts.regular, fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
  caption: { fontFamily: fonts.regular, fontSize: 12, color: colors.textTertiary, lineHeight: 16 },
  button: { fontFamily: fonts.semibold, fontSize: 16, color: colors.textInverse },
  label: { fontFamily: fonts.medium, fontSize: 13, color: colors.textSecondary },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;
