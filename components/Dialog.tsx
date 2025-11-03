import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';

const { width } = Dimensions.get('window');

interface DialogButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface DialogProps {
  visible: boolean;
  title: string;
  message: string;
  type?: 'default' | 'success' | 'warning' | 'error' | 'info';
  buttons: DialogButton[];
  onClose?: () => void;
}

export function Dialog({ visible, title, message, type = 'default', buttons, onClose }: DialogProps) {
  const { colors, isDark } = useTheme();

  function getIcon() {
    const iconSize = 48;
    switch (type) {
      case 'success':
        return <CheckCircle size={iconSize} color="#10b981" />;
      case 'warning':
        return <AlertCircle size={iconSize} color="#f59e0b" />;
      case 'error':
        return <XCircle size={iconSize} color="#ef4444" />;
      case 'info':
        return <Info size={iconSize} color="#3b82f6" />;
      default:
        return null;
    }
  }

  function getButtonStyle(buttonStyle: string) {
    switch (buttonStyle) {
      case 'cancel':
        return {
          backgroundColor: colors.surfaceSecondary,
          textColor: colors.textSecondary,
        };
      case 'destructive':
        return {
          backgroundColor: colors.dangerLight,
          textColor: colors.danger,
        };
      default:
        return {
          backgroundColor: colors.primaryLight,
          textColor: colors.primary,
        };
    }
  }

  function handleButtonPress(button: DialogButton) {
    if (button.onPress) {
      button.onPress();
    }
    if (onClose) {
      onClose();
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent>
      <BlurView intensity={isDark ? 40 : 20} style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={[styles.dialog, { backgroundColor: colors.surface }]}>
          {type !== 'default' && (
            <View style={styles.iconContainer}>
              {getIcon()}
            </View>
          )}

          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>

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
                  activeOpacity={0.7}>
                  <Text style={[styles.buttonText, { color: buttonStyles.textColor }]}>
                    {button.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    width: width - 64,
    maxWidth: 400,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonFull: {
    flex: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
