import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, ScrollView } from 'react-native';
import { useTheme } from '@/lib/theme';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  variant?: 'default' | 'underline' | 'pills';
  style?: ViewStyle;
}

export default function Tabs({ tabs, defaultTab, onTabChange, variant = 'underline', style }: TabsProps) {
  const { colors, typography, spacing, borderRadius } = useTheme();
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  const getTabStyles = (isActive: boolean): ViewStyle => {
    switch (variant) {
      case 'pills':
        return {
          backgroundColor: isActive ? colors.primary : 'transparent',
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.sm,
          borderRadius: borderRadius.full,
        };
      case 'underline':
        return {
          paddingVertical: spacing.md,
          borderBottomWidth: 2,
          borderBottomColor: isActive ? colors.primary : 'transparent',
        };
      case 'default':
      default:
        return {
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
        };
    }
  };

  const getTextColor = (isActive: boolean): string => {
    if (variant === 'pills') {
      return isActive ? colors.white : colors.textSecondary;
    }
    return isActive ? colors.primary : colors.textSecondary;
  };

  return (
    <View style={style}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, getTabStyles(isActive)]}
              onPress={() => handleTabChange(tab.id)}
              activeOpacity={0.7}
            >
              <Text style={[typography.styles.t5Semibold, { color: getTextColor(isActive) }]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.content}>{tabs.find((tab) => tab.id === activeTab)?.content}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    marginTop: 16,
  },
});
