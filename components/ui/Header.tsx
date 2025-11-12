import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/lib/theme';

interface HeaderProps {
  title: string;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
}

export const HEADER_HEIGHT = 44;

export default function Header({ title, onBackPress, rightComponent }: HeaderProps) {
  const { colors, typography, borderRadius } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: colors.surface,
          paddingTop: insets.top,
          height: insets.top + HEADER_HEIGHT,
        },
      ]}
    >
      <View style={styles.headerContent}>
        {onBackPress && (
          <TouchableOpacity style={[styles.backButton, { borderRadius: borderRadius.full }]} onPress={onBackPress}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
        )}

        <View style={styles.titleContainer}>
          <Text style={[typography.styles.st5Semibold, { color: colors.text }]} numberOfLines={1}>
            {title}
          </Text>
        </View>

        {rightComponent && <View style={styles.rightComponent}>{rightComponent}</View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  rightComponent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
