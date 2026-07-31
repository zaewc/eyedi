import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, radius, spacing, typography } from '@/theme';

interface Props {
  value: string;
  maxLength?: number;
  onChange: (next: string) => void;
  shuffle?: boolean;
  light?: boolean;
}

const BASE_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

export default function PinPad({ value, maxLength = 6, onChange, shuffle = false, light = false }: Props) {
  const keys = useMemo(() => {
    const nums = [...BASE_KEYS];
    if (shuffle) {
      for (let i = nums.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nums[i], nums[j]] = [nums[j], nums[i]];
      }
    }
    return [...nums, '', '0', 'del'];
  }, [shuffle]);

  const press = (k: string) => {
    Haptics.selectionAsync().catch(() => {});
    if (k === 'del') {
      onChange(value.slice(0, -1));
    } else if (k !== '' && value.length < maxLength) {
      onChange(value + k);
    }
  };

  return (
    <View style={styles.grid}>
      {keys.map((k, idx) => (
        <Pressable
          key={`${k}-${idx}`}
          disabled={k === ''}
          onPress={() => press(k)}
          style={({ pressed }) => [styles.key, pressed && k !== '' && styles.keyPressed]}
        >
          {k === 'del' ? (
            <Text style={[styles.delIcon, light && styles.lightText]}>⌫</Text>
          ) : (
            <Text style={[styles.keyText, light && styles.lightText]}>{k}</Text>
          )}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  key: {
    width: '32%',
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    marginBottom: spacing.sm,
  },
  keyPressed: { backgroundColor: colors.surfaceAlt },
  keyText: { ...typography.h1, fontWeight: '500' },
  delIcon: { fontSize: 26, color: colors.textSecondary },
  lightText: { color: colors.textInverse },
});
