import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MessageSquare } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import Card from '@/components/ui/Card';
import { useMemo } from 'react';

interface FeedbackSectionProps {
  onSendFeedback: () => void;
}

export function FeedbackSection({ onSendFeedback }: FeedbackSectionProps) {
  const { colors, typography, spacing } = useTheme();

  const styles = useMemo(() => createStyles({ spacing }), [spacing]);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <MessageSquare size={20} color={colors.textSecondary} />
        <Text style={[typography.styles.t4Semibold, { color: colors.text }]}>개발자에게 피드백</Text>
      </View>

      <Card variant="elevated" padding="large" onPress={onSendFeedback}>
        <TouchableOpacity style={styles.feedbackButton} activeOpacity={0.7}>
          <Text style={[typography.styles.t5Semibold, { color: colors.text }]}>의견 보내기</Text>
        </TouchableOpacity>

        <Text style={[typography.styles.t6, { color: colors.textSecondary, marginBottom: 12 }]}>
          사용하면서 불편했던 점이나,{'\n'}개선했으면 하는 부분이 있으신가요?{'\n'}
          여러분의 소중한 의견을 기다리고 있어요.
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
