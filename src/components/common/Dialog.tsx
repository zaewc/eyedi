import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '@/theme';
import Button from './Button';

interface Props {
  visible: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  children?: React.ReactNode;
}

export default function Dialog({
  visible,
  title,
  message,
  confirmText = '확인',
  cancelText,
  onConfirm,
  onCancel,
  children,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {title && <Text style={[typography.h3, styles.title]}>{title}</Text>}
          {message && <Text style={[typography.bodySecondary, styles.message]}>{message}</Text>}
          {children}
          <View style={styles.actions}>
            {cancelText && (
              <Button
                title={cancelText}
                variant="secondary"
                onPress={onCancel ?? (() => {})}
                style={styles.flexBtn}
              />
            )}
            <Button title={confirmText} onPress={onConfirm ?? (() => {})} style={styles.flexBtn} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  title: { textAlign: 'center', marginBottom: spacing.sm },
  message: { textAlign: 'center', marginBottom: spacing.lg },
  actions: { flexDirection: 'row', gap: spacing.sm },
  flexBtn: { flex: 1 },
});
