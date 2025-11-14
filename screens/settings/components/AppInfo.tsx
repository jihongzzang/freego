import { View, Text, StyleSheet } from 'react-native';
import { Info } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import Card from '@/components/ui/Card';
import { List, ListItem } from '@/components/ui/List';
import { useMemo } from 'react';
import * as StoreReview from 'expo-store-review';
import { useToast } from '@/components/ui';

export function AppInfo() {
  const { colors, typography, spacing } = useTheme();
  const { showToast } = useToast();

  const styles = useMemo(() => createStyles({ spacing }), [spacing]);

  const handleRateApp = async () => {
    try {
      const isAvailable = await StoreReview.isAvailableAsync();
      if (isAvailable) {
        await StoreReview.requestReview();
      } else {
        // 스토어 리뷰가 불가능한 경우 (예: 시뮬레이터)
        showToast({
          message: '앱 스토어에서 직접 평가해주세요',
          type: 'info',
        });
      }
    } catch (error) {
      console.error('Store review error:', error);
      showToast({
        message: '평가 화면을 열 수 없습니다',
        type: 'error',
      });
    }
  };

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
          <ListItem title="앱 평가하기" showChevron onPress={handleRateApp} />
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
