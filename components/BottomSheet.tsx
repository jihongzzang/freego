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

export default function BottomSheet({
  maxHeight,
  visible,
  onClose,
  title,
  children,
}: BottomSheetProps) {
  const { colors, typography } = useTheme();
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
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          // 아래로 충분히 드래그했거나 빠르게 스와이프한 경우 닫기
          Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            onClose();
          });
        } else {
          // 원래 위치로 복귀
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
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
        Animated.timing(keyboardTranslateY, {
          toValue: -(e.endCoordinates.height - 16),
          duration: Platform.OS === 'ios' ? 250 : 200,
          useNativeDriver: true,
        }).start();
      },
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        Animated.timing(keyboardTranslateY, {
          toValue: 0,
          duration: Platform.OS === 'ios' ? 250 : 200,
          useNativeDriver: true,
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
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      // 닫힐 때: 위에서 아래로 슬라이드
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        translateY.setValue(0);
      });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.bottomSheetContainer,
                { transform: [{ translateY }] },
                // {
                //   transform: [
                //     {
                //       translateY: Animated.add(translateY, keyboardTranslateY),
                //     },
                //   ],
                // },
              ]}
            >
              <View
                style={[
                  styles.bottomSheet,
                  {
                    backgroundColor: colors.background,
                    height: maxHeight,
                  },
                ]}
              >
                <View
                  style={styles.handleContainer}
                  {...panResponder.panHandlers}
                >
                  <View
                    style={[styles.handle, { backgroundColor: colors.border }]}
                  />
                </View>

                <View
                  style={[
                    styles.header,
                    {
                      borderBottomColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      typography.styles.h3,
                      { color: colors.text, flex: 1 },
                    ]}
                  >
                    {title}
                  </Text>
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
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  bottomSheetContainer: {
    width: '100%',
  },
  bottomSheet: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
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
