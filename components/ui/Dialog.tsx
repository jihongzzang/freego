import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, Platform } from 'react-native';
import { useMemo, useEffect } from 'react';
import { BlurView } from 'expo-blur';
// import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';

const { width } = Dimensions.get('window');

interface DialogButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface DialogProps {
  visible: boolean;
  title?: string;
  message: string;
  type?: 'default' | 'success' | 'warning' | 'error' | 'info';
  buttons: DialogButton[];
  onClose?: () => void;
}

export function Dialog({ visible, title, message, type = 'default', buttons, onClose }: DialogProps) {
  const { colors, typography, spacing, borderRadius, shadows, isDark } = useTheme();

  const styles = useMemo(() => createStyles({ spacing, borderRadius, shadows }), [spacing, borderRadius, shadows]);

  useEffect(() => {}, [visible]);

  function getButtonStyle(buttonStyle: string) {
    switch (buttonStyle) {
      case 'cancel':
        return {
          backgroundColor: colors.surfaceSecondary,
          textColor: colors.textSecondary,
        };
      case 'destructive':
        return {
          backgroundColor: colors.primary,
          textColor: colors.white,
        };
      default:
        return {
          backgroundColor: colors.primary,
          textColor: colors.white,
        };
    }
  }

  function handleButtonPress(button: DialogButton) {
    if (button.onPress) {
      button.onPress();
    }
  }

  function handleRequestClose() {
    if (onClose) {
      onClose();
    }
  }

  function handleBackdropPress() {
    if (onClose) {
      onClose();
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={Platform.OS === 'ios' ? undefined : handleRequestClose}
      // statusBarTranslucent
    >
      <BlurView intensity={isDark ? 40 : 60} style={styles.overlay}>
        <TouchableOpacity
          style={[styles.backdrop, { backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.3)' }]}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={[styles.dialog, { backgroundColor: isDark ? '#2C2C35' : colors.white }]}>
          {title && (
            <View style={styles.titleContainer}>
              <Text style={[typography.styles.t4Semibold, { color: colors.text }]}>{title}</Text>
            </View>
          )}

          <View style={styles.messageContainer}>
            <Text style={[typography.styles.t5, { color: colors.textSecondary }]}>{message}</Text>
          </View>

          <View style={styles.buttonsContainer}>
            {buttons.map((button, index) => {
              const buttonStyles = getButtonStyle(button.style || 'default');
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.button,
                    { backgroundColor: buttonStyles.backgroundColor },
                    buttons.length === 1 && styles.buttonFull,
                  ]}
                  onPress={() => handleButtonPress(button)}
                  activeOpacity={0.7}
                >
                  <Text style={[typography.styles.t5Semibold, { color: buttonStyles.textColor }]}>{button.text}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </BlurView>
    </Modal>
  );
}

const createStyles = ({
  spacing,
  borderRadius,
  shadows,
}: {
  spacing: typeof import('@/lib/theme').spacing;
  borderRadius: typeof import('@/lib/theme').borderRadius;
  shadows: typeof import('@/lib/theme').shadows;
}) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    backdrop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    dialog: {
      width: width - 54,
      maxWidth: 400,
      borderRadius: borderRadius.xxl,
      padding: spacing.xxl,
      paddingBottom: 16,
      ...shadows.lg,
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 10,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.md,
    },
    messageContainer: {
      textAlign: 'left',
      justifyContent: 'flex-start',
    },
    buttonsContainer: {
      flexDirection: 'row',
      gap: spacing.md,
      marginTop: spacing.xxl,
    },
    button: {
      flex: 1,
      paddingVertical: 11,
      paddingHorizontal: spacing.xl,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonFull: {
      flex: 1,
    },
  });
