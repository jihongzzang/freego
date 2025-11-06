import { Tabs } from 'expo-router';
import { Home, Package, Settings } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/lib/theme';
import { Platform } from 'react-native';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <Tabs
      detachInactiveScreens={false}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 0,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 8,
          height: insets.bottom > 0 ? 48 + insets.bottom : 48,
          position: 'absolute',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 0.1,
          shadowRadius: 1,
          elevation: 1,
        },
        // 애니메이션 비활성화 (커스텀 애니메이션 사용)
        animation: 'shift',
        lazy: false,

        // iOS에서 부드러운 전환
        ...(Platform.OS === 'ios' && {
          tabBarHideOnKeyboard: true,
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '내 냉장고',
          sceneStyle: { backgroundColor: colors.background },
          tabBarIcon: ({ size, color }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="ingredients"
        options={{
          title: '재료 관리',
          sceneStyle: { backgroundColor: colors.background },
          tabBarIcon: ({ size, color }) => <Package size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="shopping"
        options={{
          title: '장보기',
          sceneStyle: { backgroundColor: colors.background },
          tabBarIcon: ({ size, color }) => <Package size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '설정',
          sceneStyle: { backgroundColor: colors.background },
          tabBarIcon: ({ size, color }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
