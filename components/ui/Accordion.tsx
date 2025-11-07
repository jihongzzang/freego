import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, LayoutAnimation, Platform, UIManager } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  badge?: React.ReactNode;
  defaultExpanded?: boolean;
  onToggle?: (expanded: boolean) => void;
  style?: ViewStyle;
}

export default function Accordion({
  title,
  children,
  leftIcon,
  badge,
  defaultExpanded = false,
  onToggle,
  style,
}: AccordionProps) {
  const { colors, typography, spacing } = useTheme();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
    onToggle?.(!isExpanded);
  };

  return (
    <View style={style}>
      <TouchableOpacity style={styles.header} onPress={handleToggle} activeOpacity={0.7}>
        <View style={styles.headerLeft}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <Text style={[typography.styles.t5Semibold, { color: colors.text }]}>{title}</Text>
        </View>

        <View style={styles.headerRight}>
          {badge && <View style={styles.badge}>{badge}</View>}
          {isExpanded ? (
            <ChevronUp size={20} color={colors.textTertiary} />
          ) : (
            <ChevronDown size={20} color={colors.textTertiary} />
          )}
        </View>
      </TouchableOpacity>

      {isExpanded && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  leftIcon: {
    marginRight: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {},
  content: {
    marginTop: 12,
  },
});
