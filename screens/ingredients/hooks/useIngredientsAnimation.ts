import { Animated, Platform } from 'react-native';

export function useIngredientsAnimation(scrollY: Animated.Value) {
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

  const useNativeDriver = Platform.OS !== 'android';

  return {
    headerTranslateY,
    contentOpacity,
    useNativeDriver,
  };
}
