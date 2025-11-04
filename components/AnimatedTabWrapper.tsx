import { useEffect } from 'react';
import { Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTabNavigation, TAB_ORDER } from '@/context/TabNavigationContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type AnimatedTabWrapperProps = {
  children: React.ReactNode;
  tabName: string;
};

export function AnimatedTabWrapper({
  children,
  tabName,
}: AnimatedTabWrapperProps) {
  const { currentTabIndex, direction } = useTabNavigation();
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const tabIndex = TAB_ORDER.indexOf(tabName);
  const isActive = tabIndex === currentTabIndex;

  // useEffect(() => {
  //   if (isActive) {
  //     // 활성 탭으로 전환될 때
  //     if (direction === 'right') {
  //       // 오른쪽에서 살짝
  //       translateX.value = 10;
  //       // opacity.value = 0;
  //     } else if (direction === 'left') {
  //       // 왼쪽에서 살짝
  //       translateX.value = -10;
  //     }

  //     // 부드러운 애니메이션
  //     translateX.value = withTiming(0, {
  //       duration: 200,
  //       easing: Easing.out(Easing.ease),
  //     });
  //   } else {
  //     translateX.value = 0;
  //   }
  // }, [isActive, direction]);

  useEffect(() => {
    if (isActive) {
      // 새로 활성화된 탭 → 방향에 따라 진입
      translateX.value =
        direction === 'right'
          ? SCREEN_WIDTH * 0.05 // 오른쪽에서 들어옴
          : direction === 'left'
          ? -SCREEN_WIDTH * 0.05 // 왼쪽에서 들어옴
          : 0;

      requestAnimationFrame(() => {
        translateX.value = withTiming(0, {
          duration: 300,
          easing: Easing.out(Easing.cubic),
        });
      });
    } else {
      // 비활성화된 탭은 방향에 따라 반대쪽으로 빠짐
      translateX.value = withTiming(
        direction === 'right'
          ? -SCREEN_WIDTH * 0.05
          : direction === 'left'
          ? SCREEN_WIDTH * 0.05
          : 0,
        { duration: 200, easing: Easing.out(Easing.cubic) }
      );
    }
  }, [isActive, direction]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      opacity: 1,
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
        animatedStyle,
      ]}
      pointerEvents={isActive ? 'auto' : 'none'}
    >
      {children}
    </Animated.View>
  );
}
