import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
  PanResponder,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/lib/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// const MAX_HEIGHT = 450;

interface BottomSheetProps {
  maxHeight: number;
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function BottomSheet({ maxHeight, visible, onClose, title, children }: BottomSheetProps) {
  const { colors, typography } = useTheme();
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(0)).current;
  const keyboardTranslateY = useRef(new Animated.Value(0)).current;

  // 드래그 핸들러
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // 수직 드래그가 수평 드래그보다 클 때만 처리
        return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // 닫기 조건:
        // 1. BottomSheet 높이의 35% 이상 드래그 OR
        // 2. 빠른 스와이프 속도 (1.0 이상)
        const threshold = maxHeight * 0.35;
        if (gestureState.dy > threshold || gestureState.vy > 1.0) {
          // 아래로 충분히 드래그했거나 빠르게 스와이프한 경우 닫기
          // 즉시 onClose 호출하여 상태 업데이트
          onClose();
          // 애니메이션은 useEffect에서 처리됨
        } else {
          // 원래 위치로 복귀
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: Platform.OS == 'android' ? false : true,
            tension: 65,
            friction: 11,
          }).start();
        }
      },
    }),
  ).current;

  // 키보드 리스너
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        // iOS에서는 키보드 높이에서 Safe Area bottom을 빼고 8px 더 올림
        const offset =
          Platform.OS === 'ios' ? -(e.endCoordinates.height - insets.bottom + 8) : -(e.endCoordinates.height - 16);

        Animated.timing(keyboardTranslateY, {
          toValue: offset,
          duration: Platform.OS === 'ios' ? 250 : 200,
          useNativeDriver: Platform.OS == 'android' ? false : true,
        }).start();
      },
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        Animated.timing(keyboardTranslateY, {
          toValue: 0,
          duration: Platform.OS === 'ios' ? 250 : 200,
          useNativeDriver: Platform.OS == 'android' ? false : true,
        }).start();
      },
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  useEffect(() => {
    if (visible) {
      // 열릴 때: 아래에서 위로 슬라이드
      translateY.setValue(SCREEN_HEIGHT);
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: Platform.OS == 'android' ? false : true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      // 닫힐 때: 위에서 아래로 슬라이드
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: Platform.OS == 'android' ? false : true,
      }).start(() => {
        translateY.setValue(0);
      });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          style={[
            styles.overlay,
            {
              paddingHorizontal: Platform.OS === 'ios' ? 10 : 10,
              paddingBottom: Platform.OS === 'ios' ? Math.max(insets.bottom, 8) : 8,
            },
          ]}
        >
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.bottomSheetContainer,
                {
                  transform:
                    Platform.OS === 'ios'
                      ? [
                          {
                            translateY: Animated.add(translateY, keyboardTranslateY),
                          },
                        ]
                      : [{ translateY }],
                },
              ]}
            >
              <View
                style={[
                  styles.bottomSheet,
                  {
                    borderRadius: Platform.OS === 'ios' ? 28 : 28,
                    backgroundColor: colors.background,
                    height: maxHeight,
                  },
                ]}
              >
                <View {...panResponder.panHandlers}>
                  <View style={styles.handleContainer}>
                    <View style={[styles.handle, { backgroundColor: colors.border }]} />
                  </View>

                  <View
                    style={[
                      styles.header,
                      {
                        borderBottomColor: colors.border,
                      },
                    ]}
                  >
                    <Text style={[typography.styles.t4Semibold, { color: colors.text, flex: 1 }]}>{title}</Text>
                  </View>
                </View>
                <View style={{ flex: 1 }}>{children}</View>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheetContainer: {
    width: '100%',
  },
  bottomSheet: {
    overflow: 'hidden',
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 48,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  content: {
    flex: 1,
  },
});
