import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Database } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import Card from '@/components/ui/Card';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface DataManagementProps {
  onDeleteAllData: () => void;
}

export function DataManagement({ onDeleteAllData }: DataManagementProps) {
  const { t } = useTranslation();
  const { colors, typography, spacing } = useTheme();

  const styles = useMemo(() => createStyles({ spacing }), [spacing]);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Database size={20} color={colors.textSecondary} />
        <Text style={[typography.styles.t4Semibold, { color: colors.text }]}>{t('settings.data.title')}</Text>
      </View>

      <Card variant="elevated" padding="large">
        <TouchableOpacity style={styles.deleteButton} onPress={onDeleteAllData} activeOpacity={0.7}>
          <View style={styles.deleteButtonText}>
            <Text style={[typography.styles.t5Semibold, { color: colors.text }]}>{t('settings.data.deleteAll')}</Text>
            <Text style={[typography.styles.t7, { color: colors.textSecondary, marginTop: spacing.xs }]}>
              {t('settings.data.deleteDescription')}
            </Text>
          </View>
        </TouchableOpacity>
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
    deleteButton: {
      paddingVertical: spacing.sm,
    },
    deleteButtonText: {
      flex: 1,
    },
  });
