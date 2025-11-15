import { View, StyleSheet, ScrollView } from 'react-native';
import { useMemo } from 'react';
import { Clock } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import Header from '@/components/ui/Header';
import Card from '@/components/ui/Card';
import EmptyStateUI from '@/components/ui/EmptyState';
import { useExpiringLogic } from './hooks/useExpiringLogic';
import { ExpiringItem } from './components/ExpiringItem';

export default function ExpiringScreen() {
  const { colors, spacing } = useTheme();

  const { ingredients, loading, handleNavigateBack, handleNavigateToDetail, handleQuickAdd, handleQuickDelete } =
    useExpiringLogic();

  const styles = useMemo(() => createStyles({ spacing }), [spacing]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="" onBackPress={handleNavigateBack} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <EmptyStateUI title="로딩 중이에요..." />
        ) : ingredients.length === 0 ? (
          <EmptyStateUI
            icon={<Clock size={64} color={colors.textTertiary} />}
            title="임박한 재료가 없어요"
            description="모든 재료가 신선해요!"
          />
        ) : (
          <Card variant="elevated" padding="none">
            {ingredients.map((item) => (
              <ExpiringItem
                key={item.id}
                item={item}
                onPress={() => handleNavigateToDetail(item.id)}
                onQuickAdd={() => handleQuickAdd(item.id)}
                onQuickDelete={() => handleQuickDelete(item.id)}
              />
            ))}
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

const createStyles = ({ spacing }: { spacing: typeof import('@/lib/theme').spacing }) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      padding: spacing.lg,
    },
  });
