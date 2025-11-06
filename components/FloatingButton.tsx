import { TouchableOpacity, StyleSheet, Platform, Text, View, Animated, BackHandler } from 'react-native';
import { Plus, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/lib/theme';
import { ReactNode, useState, useRef, useEffect } from 'react';

export interface FloatingMenuItem {
  icon: ReactNode;
  label: string;
  onPress: () => void;
  backgroundColor?: string;
}

interface FloatingButtonProps {
  onPress?: () => void;
  icon?: ReactNode;
  label?: string;
  backgroundColor?: string;
  hasTabBar?: boolean; // 탭바 존재 여부
  menuItems?: FloatingMenuItem[]; // 확장 메뉴 아이템
}

export default function FloatingButton({
  onPress,
  icon,
  label,
  backgroundColor,
  hasTabBar = true,
  menuItems,
}: FloatingButtonProps) {
  const { colors, borderRadius, typography, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const [isExpanded, setIsExpanded] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const rotation = useRef(new Animated.Value(0)).current;

  // 탭바 높이를 고려한 bottom 위치 계산
  const bottomPosition = hasTabBar ? (insets.bottom > 0 ? 48 + insets.bottom : 48) + 16 : insets.bottom + 20;

  useEffect(() => {
    console.log('[FloatingButton] isExpanded changed to:', isExpanded);
    Animated.parallel([
      Animated.spring(animatedValue, {
        toValue: isExpanded ? 1 : 0,
        useNativeDriver: false,
        friction: 8,
      }),
      Animated.spring(rotation, {
        toValue: isExpanded ? 1 : 0,
        useNativeDriver: false,
        friction: 8,
      }),
    ]).start();
  }, [isExpanded]);

  // 하드웨어 뒤로가기 버튼 처리
  useEffect(() => {
    if (!isExpanded) return;

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      setIsExpanded(false);
      return true; // 이벤트를 가로챔 (기본 뒤로가기 동작 막음)
    });

    return () => backHandler.remove();
  }, [isExpanded]);

  const handleMainPress = () => {
    console.log('[FloatingButton] Main button pressed');
    if (menuItems && menuItems.length > 0) {
      console.log('[FloatingButton] Toggling expanded state:', !isExpanded);
      setIsExpanded(!isExpanded);
    } else if (onPress) {
      console.log('[FloatingButton] Executing onPress');
      onPress();
    }
  };

  const rotateIcon = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  return (
    <>
      {/* 메뉴 아이템들 - 오버레이보다 먼저 렌더링 */}
      {menuItems && menuItems.length > 0 && (
        <View
          style={[styles.menuContainer, { bottom: bottomPosition + 70, zIndex: 999 }]}
          pointerEvents={isExpanded ? 'auto' : 'none'}
        >
          {menuItems.map((item, index) => {
            const itemIndex = menuItems.length - index;
            const translateY = animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -(70 * itemIndex)],
            });

            const opacity = animatedValue.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0, 0, 1],
            });

            return (
              <Animated.View
                key={index}
                pointerEvents={isExpanded ? 'auto' : 'none'}
                style={[
                  styles.menuItem,
                  {
                    position: 'absolute',
                    transform: [{ translateY }],
                    opacity,
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() => {
                    console.log(`[FloatingButton] Menu item ${index} pressed:`, item.label);
                    item.onPress();
                    setIsExpanded(false);
                  }}
                  activeOpacity={0.8}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={styles.menuItemTouchable}
                >
                  <Text
                    style={[
                      typography.styles.bodySemibold,
                      {
                        color: colors.text,
                        marginRight: spacing.sm,
                        backgroundColor: colors.surface,
                        paddingHorizontal: spacing.md,
                        paddingVertical: spacing.xs,
                        borderRadius: borderRadius.md,
                        ...Platform.select({
                          ios: {
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.15,
                            shadowRadius: 4,
                          },
                          android: {
                            elevation: 4,
                          },
                        }),
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                  <View
                    style={[
                      styles.menuButton,
                      {
                        backgroundColor: item.backgroundColor || colors.primary,
                        borderRadius: borderRadius.full,
                        ...Platform.select({
                          ios: {
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.2,
                            shadowRadius: 4,
                          },
                          android: {
                            elevation: 4,
                          },
                        }),
                      },
                    ]}
                  >
                    {item.icon}
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      )}

      {/* 배경 오버레이 - 메뉴 아이템보다 나중에 렌더링 */}
      {isExpanded && menuItems && menuItems.length > 0 && (
        <TouchableOpacity
          style={[styles.overlay, { zIndex: 998 }]}
          activeOpacity={1}
          onPress={() => {
            console.log('[FloatingButton] Overlay pressed, closing menu');
            setIsExpanded(false);
          }}
        />
      )}

      {/* 메인 플로팅 버튼 */}
      <Animated.View
        style={[
          styles.floatingButton,
          label && styles.floatingButtonWithLabel,
          {
            backgroundColor: backgroundColor || colors.primary,
            borderRadius: borderRadius.full,
            bottom: bottomPosition,
            zIndex: 1000,
            transform: [{ rotate: menuItems && menuItems.length > 0 ? rotateIcon : '0deg' }],
            ...Platform.select({
              ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
              },
              android: {
                elevation: 8,
              },
            }),
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.touchableContent, label && styles.touchableContentWithLabel]}
          onPress={handleMainPress}
          activeOpacity={0.8}
        >
          {menuItems && menuItems.length > 0 ? (
            isExpanded ? (
              <X size={28} color="#FFFFFF" />
            ) : (
              <Plus size={28} color="#FFFFFF" />
            )
          ) : (
            icon || <Plus size={28} color="#FFFFFF" />
          )}
          {label && <Text style={[typography.styles.button, { color: '#FFFFFF', marginLeft: 8 }]}>{label}</Text>}
        </TouchableOpacity>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  menuContainer: {
    position: 'absolute',
    right: 20,
    alignItems: 'flex-end',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuItemTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingButtonWithLabel: {
    width: 'auto',
    paddingHorizontal: 0,
  },
  touchableContent: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchableContentWithLabel: {
    width: 'auto',
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
});
