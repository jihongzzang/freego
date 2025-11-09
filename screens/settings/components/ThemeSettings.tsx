import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Moon, Sun } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import Card from '@/components/ui/Card';
import Switch from '@/components/ui/Switch';
import { useMemo } from 'react';

interface ThemeSettingsProps {
  isDark: boolean;
  themePreference: 'light' | 'dark' | 'system';
  onToggleTheme: () => void;
  onResetToSystem: () => void;
}

export function ThemeSettings({ isDark, themePreference, onToggleTheme, onResetToSystem }: ThemeSettingsProps) {
  const { colors, typography, spacing, borderRadius } = useTheme();

  const styles = useMemo(() => createStyles({ spacing, borderRadius }), [spacing, borderRadius]);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        {isDark ? <Moon size={20} color={colors.textSecondary} /> : <Sun size={20} color={colors.textSecondary} />}
        <Text style={[typography.styles.t4Semibold, { color: colors.text }]}>테마</Text>
      </View>

      <Card variant="elevated" padding="large">
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={[typography.styles.t5Semibold, { color: colors.text }]}>다크 모드</Text>
          </View>
          <Switch value={isDark} onValueChange={onToggleTheme} />
        </View>

        {themePreference !== 'system' && (
          <TouchableOpacity
            style={[styles.systemResetButton, { borderTopColor: colors.border }]}
            onPress={onResetToSystem}
            activeOpacity={0.7}
          >
            <Text style={[typography.styles.t6Medium, { color: colors.textSecondary }]}>시스템 설정으로 되돌리기</Text>
          </TouchableOpacity>
        )}
      </Card>
    </View>
  );
}

const createStyles = ({
  spacing,
  borderRadius,
}: {
  spacing: typeof import('@/lib/theme').spacing;
  borderRadius: typeof import('@/lib/theme').borderRadius;
}) =>
  StyleSheet.create({
    section: {
      marginBottom: spacing.xxl,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    settingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    settingInfo: {
      flex: 1,
    },
    systemResetButton: {
      marginTop: spacing.md,
      paddingTop: spacing.md,
      borderTopWidth: 1,
    },
  });
