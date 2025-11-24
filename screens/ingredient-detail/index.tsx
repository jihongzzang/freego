import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useMemo } from 'react';
import { Edit3 } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import Header from '@/components/ui/Header';
import FloatingButton from '@/components/ui/FloatingButton';
import { useIngredientDetailLogic } from './hooks/useIngredientDetailLogic';
import { DetailView } from './components/DetailView';
import { ActionButtons } from './components/ActionButtons';
import { useTranslation } from 'react-i18next';

export default function IngredientDetailScreen() {
  const { t } = useTranslation();
  const { colors, typography, spacing } = useTheme();

  const { state, handleDelete, handleConsume, handleBackPress, handleEdit } = useIngredientDetailLogic();

  const styles = useMemo(() => createStyles({ spacing }), [spacing]);

  if (!state.ingredient) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[typography.styles.t6, { color: colors.text }]}>{t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="" onBackPress={handleBackPress} />
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <DetailView ingredient={state.ingredient} />
        <ActionButtons onConsume={handleConsume} onDelete={handleDelete} />
      </ScrollView>
      <FloatingButton onPress={handleEdit} icon={<Edit3 size={24} color="#FFFFFF" />} hasTabBar={false} />
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
