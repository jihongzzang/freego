import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/lib/theme';
import Badge from '@/components/ui/Badge';
import { getStatusColor, getStatusLabel, getCalculateStatus } from '@/utils/status';
import { getCategoryIcon, getCategoryLabel } from '@/utils/category';
import { Ingredient } from '@/data/models/ingredient.model';
import { getStorageLocationLabel } from '@/utils/storageLocation';
import { toLocalDate } from '@/utils/time';

interface DetailViewProps {
  ingredient: Ingredient;
}

export function DetailView({ ingredient }: DetailViewProps) {
  const { colors, typography } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.mainInfo, { borderBottomColor: colors.border }]}>
        <Text style={[typography.styles.st8Semibold, { color: colors.text }]}>
          {ingredient.emoji ? `${ingredient.emoji} ${ingredient.name}` : ingredient.name}
        </Text>
        <Badge
          variant="primary"
          style={{
            backgroundColor: getStatusColor(getCalculateStatus(ingredient.expiry_date)),
            paddingHorizontal: 12,
            paddingVertical: 6,
          }}
        >
          <Text style={[typography.styles.t7Semibold, { color: '#ffffff' }]}>
            {getStatusLabel({ expiryDate: ingredient.expiry_date })}
          </Text>
        </Badge>
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <Text style={[typography.styles.t7, { color: colors.textSecondary }]}>카테고리</Text>

          <View style={styles.categoryContentRow}>
            {getCategoryIcon(ingredient.category)}
            <Text style={[typography.styles.t5Semibold, { color: colors.text }]}>
              {getCategoryLabel({ category: ingredient.category })}
            </Text>
          </View>
        </View>
        <View style={styles.infoItem}>
          <Text style={[typography.styles.t7, { color: colors.textSecondary }]}>수량</Text>
          <Text style={[typography.styles.t5Semibold, { color: colors.text }]}>{ingredient.quantity || '-'}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={[typography.styles.t7, { color: colors.textSecondary }]}>보관 위치</Text>
          <Text style={[typography.styles.t5Semibold, { color: colors.text }]}>
            {ingredient.storage_location
              ? getStorageLocationLabel({ storageLocation: ingredient.storage_location })
              : '-'}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={[typography.styles.t7, { color: colors.textSecondary }]}>등록일</Text>
          <Text style={[typography.styles.t5Semibold, { color: colors.text }]}>
            {toLocalDate(ingredient.created_at) || '-'}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={[typography.styles.t7, { color: colors.textSecondary }]}>구매일</Text>
          <Text style={[typography.styles.t5Semibold, { color: colors.text }]}>
            {ingredient.purchased_date ? toLocalDate(ingredient.purchased_date) : '-'}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={[typography.styles.t7, { color: colors.textSecondary }]}>유통기한</Text>
          <Text style={[typography.styles.t5Semibold, { color: colors.text }]}>
            {ingredient.expiry_date ? toLocalDate(ingredient.expiry_date) : '-'}
          </Text>
        </View>
      </View>

      {ingredient.memo && (
        <View style={[styles.memoSection, { borderTopColor: colors.border }]}>
          <Text style={[typography.styles.t6Medium, { color: colors.textSecondary }]}>메모</Text>
          <Text style={[typography.styles.t7, { color: colors.text }]}>{ingredient.memo}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  mainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 24,
    borderBottomWidth: 1,
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memoSection: {
    gap: 8,
    paddingTop: 24,
    borderTopWidth: 1,
  },
  categoryContentRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
