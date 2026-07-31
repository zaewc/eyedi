import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/theme';

interface Props {
  length: number;
  filled: number;
  light?: boolean;
}

export default function PinDots({ length, filled, light }: Props) {
  return (
    <View style={styles.row}>
      {Array.from({ length }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            {
              backgroundColor:
                i < filled
                  ? light
                    ? colors.textInverse
                    : colors.primary
                  : light
                    ? 'rgba(255,255,255,0.3)'
                    : colors.border,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center', gap: spacing.md },
  dot: { width: 16, height: 16, borderRadius: 8 },
});
