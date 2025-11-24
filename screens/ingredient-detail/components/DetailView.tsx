import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/lib/theme';
import Badge from '@/components/ui/Badge';
import { getStatusColor, getStatusLabel, getCalculateStatus } from '@/utils/status';
import { getCategoryIcon, getCategoryLabel } from '@/utils/category';
import { Ingredient } from '@/data/models/ingredient.model';
import { getStorageLocationLabel } from '@/utils/storageLocation';
import { toLocalDate } from '@/utils/time';
import { useTranslation } from 'react-i18next';

interface DetailViewProps {
  ingredient: Ingredient;
}

export function DetailView({ ingredient }: DetailViewProps) {
  const { t, i18n } = useTranslation();
  const { colors, typography } = useTheme();
  const lang = i18n.language === 'ko' ? 'kr' : 'en';

  return (
    <View style={styles.container}>
      <View style={[styles.mainInfo, { borderBottomColor: colors.border }]}>
        <Text style={[typography.styles.st8Semibold, { color: colors.text }]}>
          {ingredient.emoji ? `${ingredient.emoji} ${ingredient.name}` : ingredient.name}
        </Text>
        <Badge
          variant="primary"
          style={{
            backgroundColor: getStatusColor(getCalculateStatus(ingredient.expired_date_time)),
            paddingHorizontal: 12,
            paddingVertical: 6,
          }}
        >
          <Text style={[typography.styles.t7Semibold, { color: '#ffffff' }]}>
            {getStatusLabel({ expiryDate: ingredient.expired_date_time, lang })}
          </Text>
        </Badge>
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <Text style={[typography.styles.t7, { color: colors.textSecondary }]}>{t('common.category')}</Text>

          <View style={styles.categoryContentRow}>
            {getCategoryIcon(ingredient.category)}
            <Text style={[typography.styles.t5Semibold, { color: colors.text }]}>
              {getCategoryLabel({ category: ingredient.category, lang })}
            </Text>
          </View>
        </View>
        <View style={styles.infoItem}>
          <Text style={[typography.styles.t7, { color: colors.textSecondary }]}>{t('common.quantity')}</Text>
          <Text style={[typography.styles.t5Semibold, { color: colors.text }]}>{ingredient.quantity || '-'}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={[typography.styles.t7, { color: colors.textSecondary }]}>{t('common.storageLocation')}</Text>
          <Text style={[typography.styles.t5Semibold, { color: colors.text }]}>
            {ingredient.storage_location
              ? getStorageLocationLabel({ storageLocation: ingredient.storage_location, lang })
              : '-'}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={[typography.styles.t7, { color: colors.textSecondary }]}>{t('common.registeredDate')}</Text>
          <Text style={[typography.styles.t5Semibold, { color: colors.text }]}>
            {ingredient.created_date_time ? toLocalDate(ingredient.created_date_time) : '-'}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={[typography.styles.t7, { color: colors.textSecondary }]}>{t('common.purchasedDate')}</Text>
          <Text style={[typography.styles.t5Semibold, { color: colors.text }]}>
            {ingredient.purchased_date_time ? toLocalDate(ingredient.purchased_date_time) : '-'}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={[typography.styles.t7, { color: colors.textSecondary }]}>{t('common.expiryDate')}</Text>
          <Text style={[typography.styles.t5Semibold, { color: colors.text }]}>
            {ingredient.expired_date_time ? toLocalDate(ingredient.expired_date_time) : '-'}
          </Text>
        </View>
      </View>

      {ingredient.memo && (
        <View style={[styles.memoSection, { borderTopColor: colors.border }]}>
          <Text style={[typography.styles.t6Medium, { color: colors.textSecondary }]}>{t('common.memo')}</Text>
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
