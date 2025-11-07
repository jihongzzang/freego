import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import { Ingredient } from '@/mvi/features/home';
import { StatusType } from '@/constants/itemStatus';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

interface IngredientCardProps {
  item: Ingredient;
  onPress: () => void;
  onCalendarPress: () => void;
  getExpiryDisplay: (status: StatusType, daysRemaining: number | null) => string;
}

export function IngredientCard({ item, onPress, onCalendarPress, getExpiryDisplay }: IngredientCardProps) {
  const { colors, typography } = useTheme();

  return (
    <Card variant="outlined" padding="small" onPress={onPress} style={styles.cardWrapper}>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.emojiContainer}>
            <Text style={typography.styles.t5}>{item.emoji || '🍽️'}</Text>
            {item.status === 'expired' && <Badge variant="danger" dot size="small" style={styles.statusBadge} />}
          </View>
          <TouchableOpacity
            style={styles.calendarButton}
            onPress={(e) => {
              e.stopPropagation();
              onCalendarPress();
            }}
            activeOpacity={0.7}
          >
            <Calendar size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>
        <Text style={[typography.styles.t6Medium, { color: colors.text }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text
          style={[
            typography.styles.t7,
            {
              marginTop: 2,
              color: item.status === 'expired' ? colors.danger : colors.textTertiary,
            },
          ]}
          numberOfLines={1}
        >
          {getExpiryDisplay(item.status, item.daysRemaining)}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    width: '48%',
  },
  cardContent: {
    alignItems: 'flex-start',
    width: '100%',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 4,
  },
  emojiContainer: {
    position: 'relative',
  },
  statusBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
  },
  calendarButton: {
    padding: 4,
    marginTop: -4,
    marginRight: -4,
  },
});
