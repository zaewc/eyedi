import { TextStyle } from 'react-native';
import { colors } from './colors';

export const typography: Record<string, TextStyle> = {
  h1: { fontSize: 26, fontWeight: '700', color: colors.text, lineHeight: 34 },
  h2: { fontSize: 22, fontWeight: '700', color: colors.text, lineHeight: 30 },
  h3: { fontSize: 18, fontWeight: '600', color: colors.text, lineHeight: 26 },
  title: { fontSize: 16, fontWeight: '600', color: colors.text, lineHeight: 24 },
  body: { fontSize: 15, fontWeight: '400', color: colors.text, lineHeight: 22 },
  bodySecondary: { fontSize: 14, fontWeight: '400', color: colors.textSecondary, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400', color: colors.textTertiary, lineHeight: 16 },
  button: { fontSize: 16, fontWeight: '600', color: colors.textInverse },
  label: { fontSize: 13, fontWeight: '500', color: colors.textSecondary },
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
