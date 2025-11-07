import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ColorPalette, useTheme } from '@/lib/theme';
import { LIFESTYLE_PACKAGES } from '@/constants/starterPackages';
import { useMemo } from 'react';
import { Card } from '@/components/ui';
import { ChevronRight } from 'lucide-react-native';

interface LifestyleSelectionProps {
  onSelectLifestyle: (lifestyleId: string) => void;
  onSkip: () => void;
}

export function LifestyleSelection({ onSelectLifestyle, onSkip }: LifestyleSelectionProps) {
  const { colors, typography, spacing, borderRadius, shadows, isDark } = useTheme();

  const insets = useSafeAreaInsets();

  const styles = useMemo(
    () => createStyles({ colors, spacing, borderRadius, shadows }),
    [spacing, borderRadius, shadows],
  );

  return (
    <View style={[styles.content, { backgroundColor: colors.surface }]}>
      <View style={[styles.packageChoiceContainer, { paddingTop: insets.top }]}>
        <View style={styles.headerSection}>
          <Text style={[typography.styles.t1Bold, styles.packageTitle, { color: colors.text }]}>
            "나의 라이프스타일은?"
          </Text>
          <Text style={[typography.styles.t4, styles.packageDescription, { color: colors.textSecondary }]}>
            "맞춤형 재료 리스트를 만들어드려요"
          </Text>
        </View>

        <ScrollView
          style={styles.lifestyleScrollView}
          contentContainerStyle={styles.lifestyleScrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.lifestyleList}>
            {LIFESTYLE_PACKAGES.map((lifestyle, index) => (
              <Card
                key={lifestyle.id}
                variant="elevated"
                padding="large"
                onPress={() => onSelectLifestyle(lifestyle.id)}
                style={{
                  ...styles.lifestyleCard,
                  ...{ backgroundColor: isDark ? colors.white : colors.surfaceSecondary },
                }}
              >
                <View style={styles.lifestyleCardLeft}>
                  <View
                    style={[styles.lifestyleIconBadge, { backgroundColor: isDark ? colors.grey100 : colors.grey300 }]}
                  >
                    <Text style={typography.styles.st5Semibold}>{lifestyle.icon}</Text>
                  </View>
                  <View style={styles.lifestyleInfo}>
                    <Text style={[typography.styles.t5Semibold, styles.lifestyleLabel]}>{lifestyle.krLabel}</Text>
                    <Text style={[typography.styles.t6, styles.lifestyleDesc]} numberOfLines={2}>
                      {lifestyle.description}
                    </Text>
                  </View>
                </View>
                <View style={styles.arrowIcon}>
                  <ChevronRight size={20} color={colors.grey400} />
                </View>
              </Card>
            ))}
          </View>

          <TouchableOpacity style={styles.skipPackageButton} onPress={onSkip} activeOpacity={0.8}>
            <Text style={[typography.styles.t5Semibold, styles.skipPackageText]}>건너뛰고 직접 등록할게요</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const createStyles = ({
  colors,
  spacing,
  borderRadius,
  shadows,
}: {
  colors: ColorPalette;
  spacing: typeof import('@/lib/theme').spacing;
  borderRadius: typeof import('@/lib/theme').borderRadius;
  shadows: typeof import('@/lib/theme').shadows;
}) =>
  StyleSheet.create({
    content: {
      flex: 1,
    },

    container: {
      flex: 1,
      paddingBottom: 60,
    },

    // 라이프스타일 선택 화면
    packageChoiceContainer: {
      flex: 1,
      paddingHorizontal: spacing.xl,
      paddingBottom: 60,
    },

    headerSection: {
      marginBottom: spacing.sm,
      paddingHorizontal: spacing.xs,
    },

    lifestyleScrollView: {
      flex: 1,
    },

    lifestyleScrollContent: {
      paddingBottom: spacing.xxl,
    },

    packageTitle: {
      textAlign: 'left',
      marginBottom: spacing.xs,
    },

    packageDescription: {
      textAlign: 'left',
    },

    lifestyleList: {
      gap: spacing.lg,
      marginBottom: spacing.xxl,
    },

    lifestyleCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    lifestyleCardLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: spacing.lg,
    },

    lifestyleIconBadge: {
      width: 64,
      height: 64,
      borderRadius: borderRadius.xl,
      alignItems: 'center',
      justifyContent: 'center',
    },

    lifestyleInfo: {
      flex: 1,
      gap: spacing.xs,
    },

    lifestyleLabel: {
      color: colors.grey800,
    },

    lifestyleDesc: {
      color: colors.grey600,
    },

    arrowIcon: {
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },

    skipPackageButton: {
      paddingVertical: spacing.xl,
      alignItems: 'center',
      marginTop: spacing.md,
    },

    skipPackageText: {
      color: colors.grey400,
      opacity: 0.9,
    },
  });
