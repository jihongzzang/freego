import { Tabs } from 'expo-router';
import {
  Home,
  Plus,
  ShoppingCart,
  BarChart3,
  Settings,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/lib/theme';
import { Platform } from 'react-native';
import { TabNavigationProvider } from '@/context/TabNavigationContext';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <TabNavigationProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textTertiary,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
            paddingTop: 8,
            height: insets.bottom > 0 ? 65 + insets.bottom : 65,
          },
          // 애니메이션 비활성화 (커스텀 애니메이션 사용)
          animation: 'none',
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
            title: '홈',
            tabBarIcon: ({ size, color }) => <Home size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            title: '추가',
            tabBarIcon: ({ size, color }) => <Plus size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="shopping"
          options={{
            title: '장보기',
            tabBarIcon: ({ size, color }) => (
              <ShoppingCart size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="statistics"
          options={{
            title: '통계',
            tabBarIcon: ({ size, color }) => (
              <BarChart3 size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: '설정',
            tabBarIcon: ({ size, color }) => (
              <Settings size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </TabNavigationProvider>
  );
}
