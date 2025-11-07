import { Animated } from 'react-native';

export function useHomeAnimation(scrollY: Animated.Value) {
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -60],
    extrapolate: 'clamp',
  });

  const contentOpacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return {
    headerTranslateY,
    contentOpacity,
  };
}
