import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Database } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import Card from '@/components/ui/Card';
import { useMemo } from 'react';

interface DataManagementProps {
  onDeleteAllData: () => void;
}

export function DataManagement({ onDeleteAllData }: DataManagementProps) {
  const { colors, typography, spacing } = useTheme();

  const styles = useMemo(() => createStyles({ spacing }), [spacing]);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Database size={20} color={colors.textSecondary} />
        <Text style={[typography.styles.t4Semibold, { color: colors.text }]}>데이터 관리</Text>
      </View>

      <Card variant="elevated" padding="large">
        <TouchableOpacity style={styles.deleteButton} onPress={onDeleteAllData} activeOpacity={0.7}>
          <View style={styles.deleteButtonText}>
            <Text style={[typography.styles.t5Semibold, { color: colors.text }]}>냉장고 데이터 삭제</Text>
            <Text style={[typography.styles.t7, { color: colors.textSecondary, marginTop: spacing.xs }]}>
              등록된 모든 재료가 삭제돼요
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
