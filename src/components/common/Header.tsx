import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '@/theme';

interface Props {
  title?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  light?: boolean;
}

export default function Header({ title, onBack, right, light }: Props) {
  const insets = useSafeAreaInsets();
  const tint = light ? colors.textInverse : colors.text;
  return (
    <View style={[styles.wrap, { paddingTop: insets.top }]}>
      <View style={styles.row}>
        <View style={styles.side}>
          {onBack && (
            <Pressable onPress={onBack} hitSlop={12} style={styles.backBtn}>
              <Text style={[styles.backIcon, { color: tint }]}>‹</Text>
            </Pressable>
          )}
        </View>
        <Text numberOfLines={1} style={[typography.title, styles.title, { color: tint }]}>
          {title ?? ''}
        </Text>
        <View style={[styles.side, styles.rightSide]}>{right}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { backgroundColor: colors.transparent },
  row: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  side: { width: 56, justifyContent: 'center' },
  rightSide: { alignItems: 'flex-end' },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 34, marginTop: -4, fontWeight: '400' },
  title: { flex: 1, textAlign: 'center' },
});
