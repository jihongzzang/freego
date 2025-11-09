import { View, Text, StyleSheet } from 'react-native';
import { Info } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import Card from '@/components/ui/Card';
import { List, ListItem } from '@/components/ui/List';
import { useMemo } from 'react';

export function AppInfo() {
  const { colors, typography, spacing } = useTheme();

  const styles = useMemo(() => createStyles({ spacing }), [spacing]);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Info size={20} color={colors.textSecondary} />
        <Text style={[typography.styles.t4Semibold, { color: colors.text }]}>앱 정보</Text>
      </View>

      <Card variant="elevated" padding="none">
        <List>
          <ListItem title="버전" rightText="1.0.0" />
          <ListItem title="개발자" rightText="주민준, laonzenamoon" />
          <ListItem title="문의" rightText="jujihong2@gmail.com" />
        </List>
      </Card>
    </View>
  );
}

const createStyles = ({ spacing }: { spacing: typeof import('@/lib/theme').spacing }) =>
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
  });
