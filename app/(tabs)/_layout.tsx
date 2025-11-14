import { Tabs } from 'expo-router';
import { Award, ClipboardList, Home, Layers, Package, Refrigerator, Settings, ShoppingCart } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/lib/theme';
import { Platform, Text, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

function AnimatedTabBarButton({ children, onPress, ...props }: any) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.85, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 150 });
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      {...props}
    >
      <Animated.View
        style={[
          {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          },
          animatedStyle,
        ]}
      >
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  const { colors, isDark, typography } = useTheme();

  return (
    <Tabs
      detachInactiveScreens={false}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 0,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 8,
          height: insets.bottom > 0 ? 48 + insets.bottom : 48,
          position: 'absolute',
          shadowColor: isDark ? '#3C3C47' : colors.grey200,
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 1,
          shadowRadius: 1,
          elevation: 1,
        },
        animation: 'shift',
        lazy: false,
        tabBarButton: (props) => <AnimatedTabBarButton {...props} />, // ✅ 커스텀 버튼 적용
        ...(Platform.OS === 'ios' && {
          tabBarHideOnKeyboard: true,
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          sceneStyle: { backgroundColor: colors.background },
          tabBarLabel: ({ focused }) => (
            <Text
              style={[
                typography.styles.t8Medium,
                {
                  color: isDark
                    ? focused
                      ? colors.grey200
                      : colors.grey600
                    : focused
                      ? colors.grey900
                      : colors.grey600,
                },
              ]}
            >
              내 냉장고
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Refrigerator
              size={24}
              color={isDark ? (focused ? colors.grey200 : colors.grey700) : focused ? colors.grey800 : colors.grey400}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="ingredients"
        options={{
          title: '재료 관리',
          sceneStyle: { backgroundColor: colors.background },
          tabBarLabel: ({ focused }) => (
            <Text
              style={[
                typography.styles.t8Medium,
                {
                  color: isDark
                    ? focused
                      ? colors.grey200
                      : colors.grey600
                    : focused
                      ? colors.grey900
                      : colors.grey600,
                },
              ]}
            >
              재료 관리
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <ClipboardList
              size={24}
              color={isDark ? (focused ? colors.grey200 : colors.grey700) : focused ? colors.grey800 : colors.grey400}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="shopping"
        options={{
          title: '장보기',
          sceneStyle: { backgroundColor: colors.background },
          tabBarLabel: ({ focused }) => (
            <Text
              style={[
                typography.styles.t8Medium,
                {
                  color: isDark
                    ? focused
                      ? colors.grey200
                      : colors.grey600
                    : focused
                      ? colors.grey900
                      : colors.grey600,
                },
              ]}
            >
              장보기
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <ShoppingCart
              size={24}
              color={isDark ? (focused ? colors.grey200 : colors.grey700) : focused ? colors.grey800 : colors.grey400}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="achievement"
        options={{
          title: '챌린지',
          sceneStyle: { backgroundColor: colors.background },
          tabBarLabel: ({ focused }) => (
            <Text
              style={[
                typography.styles.t8Medium,
                {
                  color: isDark
                    ? focused
                      ? colors.grey200
                      : colors.grey600
                    : focused
                      ? colors.grey900
                      : colors.grey600,
                },
              ]}
            >
              챌린지
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Award
              size={24}
              color={isDark ? (focused ? colors.grey200 : colors.grey700) : focused ? colors.grey800 : colors.grey400}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '설정',
          sceneStyle: { backgroundColor: colors.background },
          tabBarLabel: ({ focused }) => (
            <Text
              style={[
                typography.styles.t8Medium,
                {
                  color: isDark
                    ? focused
                      ? colors.grey200
                      : colors.grey600
                    : focused
                      ? colors.grey900
                      : colors.grey600,
                },
              ]}
            >
              설정
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Settings
              size={24}
              color={isDark ? (focused ? colors.grey200 : colors.grey700) : focused ? colors.grey800 : colors.grey400}
            />
          ),
        }}
      />
    </Tabs>
  );
}
