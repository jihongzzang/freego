import { View, Text, StyleSheet, Animated, Dimensions, Platform } from 'react-native';
import { useEffect, useRef, useMemo, useCallback } from 'react';
import { useTheme } from '@/lib/theme';
import { Info, CheckCircle2 } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export type ToastType = 'success' | 'error' | 'info' | 'warning';
export type ToastPosition = 'top' | 'bottom';

export interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  position?: ToastPosition;
  duration?: number;
  onHide?: () => void;
}

export function Toast({
  visible,
  message,
  type = 'success',
  position = 'bottom',
  duration = 3000,
  onHide,
}: ToastProps) {
  const { colors, typography, spacing, borderRadius, shadows, isDark } = useTheme();
  const translateY = useRef(new Animated.Value(position === 'top' ? -100 : 100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const styles = useMemo(() => createStyles({ spacing, borderRadius, shadows }), [spacing, borderRadius, shadows]);

  const hide = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: position === 'top' ? -100 : 100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onHide) {
        onHide();
      }
    });
  }, [translateY, opacity, position, onHide]);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 8,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        hide();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, translateY, opacity, hide]);

  const getToastIcon = () => {
    const iconSize = 24;

    switch (type) {
      case 'success':
        return <CheckCircle2 size={iconSize} color={colors.green600} />;
      case 'error':
        return <Info size={iconSize} color={colors.red500} />;
      case 'warning':
        return <Info size={iconSize} color={colors.orange500} />;
      case 'info':
      default:
        return <Info size={iconSize} color={colors.yellow500} />;
    }
  };

  const getToastColor = () => {
    switch (type) {
      case 'success':
        return {
          background: isDark ? '#2C2C35' : colors.grey600,
          text: isDark ? '#9E9EA4' : colors.whiteOpactiy600,
        };
      case 'error':
        return {
          background: isDark ? '#2C2C35' : colors.grey600,
          text: isDark ? '#9E9EA4' : colors.whiteOpactiy600,
        };
      case 'warning':
        return {
          background: isDark ? '#2C2C35' : colors.grey600,
          text: isDark ? '#9E9EA4' : colors.whiteOpactiy600,
        };
      case 'info':
      default:
        return {
          background: isDark ? '#2C2C35' : colors.grey600,
          text: isDark ? '#9E9EA4' : colors.whiteOpactiy600,
        };
    }
  };

  const toastColors = getToastColor();

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        position === 'top' ? styles.topPosition : styles.bottomPosition,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
      pointerEvents="box-none"
    >
      <View
        style={[
          styles.toast,
          {
            backgroundColor: toastColors.background,
            borderWidth: 0,
          },
        ]}
      >
        {getToastIcon()}
        <Text style={[typography.styles.t5Semibold, { color: toastColors.text, flex: 1, marginLeft: spacing.sm }]}>
          {message}
        </Text>
      </View>
    </Animated.View>
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
    container: {
      position: 'absolute',
      left: 0,
      right: 0,
      zIndex: 999999,
      elevation: 999999,
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
    },
    topPosition: {
      top: Platform.OS === 'ios' ? 60 : 20,
    },
    bottomPosition: {
      bottom: Platform.OS === 'ios' ? 100 : 80,
    },
    toast: {
      width: width - spacing.lg * 2,
      maxWidth: 500,
      borderRadius: borderRadius.lg,
      paddingHorizontal: 15,
      paddingVertical: 14,
      flexDirection: 'row',
      alignItems: 'center',
      ...shadows.md,
      shadowOpacity: 0.15,
      elevation: 5,
    },
  });
