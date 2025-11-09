import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import Divider from './Divider';

interface ListItemProps {
  title: string;
  description?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  rightText?: string;
  showChevron?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export function ListItem({
  title,
  description,
  leftIcon,
  rightIcon,
  rightText,
  showChevron = false,
  onPress,
  style,
}: ListItemProps) {
  const { colors, typography, spacing } = useTheme();

  const content = (
    <View style={[styles.item, style]}>
      {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
      <View style={styles.content}>
        <Text style={[typography.styles.t6, { color: colors.text }]}>{title}</Text>
        {description && (
          <Text style={[typography.styles.t6, { color: colors.textSecondary, marginTop: spacing.xs }]}>
            {description}
          </Text>
        )}
      </View>
      {rightText && (
        <Text style={[typography.styles.t6, { color: colors.textSecondary, marginRight: spacing.sm }]}>
          {rightText}
        </Text>
      )}
      {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      {showChevron && <ChevronRight size={20} color={colors.textTertiary} />}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

interface ListProps {
  children: React.ReactNode;
  showDividers?: boolean;
  style?: ViewStyle;
}

export function List({ children, showDividers = true, style }: ListProps) {
  const childArray = React.Children.toArray(children);

  return (
    <View style={style}>
      {childArray.map((child, index) => (
        <React.Fragment key={index}>
          {child}
          {showDividers && index < childArray.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  leftIcon: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  rightIcon: {
    marginLeft: 8,
  },
});
