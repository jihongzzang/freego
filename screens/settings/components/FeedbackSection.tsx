import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MessageSquare } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import Card from '@/components/ui/Card';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface FeedbackSectionProps {
  onSendFeedback: () => void;
}

export function FeedbackSection({ onSendFeedback }: FeedbackSectionProps) {
  const { t } = useTranslation();
  const { colors, typography, spacing } = useTheme();

  const styles = useMemo(() => createStyles({ spacing }), [spacing]);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <MessageSquare size={20} color={colors.textSecondary} />
        <Text style={[typography.styles.t4Semibold, { color: colors.text }]}>{t('settings.feedback.title')}</Text>
      </View>

      <Card variant="elevated" padding="large" onPress={onSendFeedback}>
        <TouchableOpacity style={styles.feedbackButton} activeOpacity={0.7}>
          <Text style={[typography.styles.t5Semibold, { color: colors.text }]}>{t('settings.feedback.send')}</Text>
        </TouchableOpacity>

        <Text style={[typography.styles.t6, { color: colors.textSecondary, marginBottom: 12 }]}>
          {t('settings.feedback.description')}
        </Text>
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
    feedbackButton: {
      paddingVertical: spacing.sm,
    },
  });
