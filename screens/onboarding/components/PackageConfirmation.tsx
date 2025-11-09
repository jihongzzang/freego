import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ColorPalette, useTheme } from '@/lib/theme';
import { LIFESTYLE_PACKAGES } from '@/constants/starterPackages';
import { useMemo } from 'react';
import { Button, Card, Chip } from '@/components/ui';
import { ArrowLeft } from 'lucide-react-native';

interface PackageConfirmationProps {
  selectedLifestyleId: string;
  onBack: () => void;
  onAddPackage: () => void;
  onSkipPackage: () => void;
}

export function PackageConfirmation({
  selectedLifestyleId,
  onBack,
  onAddPackage,
  onSkipPackage,
}: PackageConfirmationProps) {
  const { colors, typography, spacing, borderRadius, shadows, isDark } = useTheme();

  const insets = useSafeAreaInsets();

  const selectedPackage = LIFESTYLE_PACKAGES.find((pkg) => pkg.id === selectedLifestyleId);

  const styles = useMemo(() => createStyles({ colors, spacing, borderRadius }), [spacing, borderRadius, shadows]);

  if (!selectedPackage) return null;

  return (
    <View style={[styles.content, { backgroundColor: colors.surface }]}>
      <ScrollView
        contentContainerStyle={[styles.packageChoiceContainer, { paddingTop: insets.top }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.confirmHeaderSection}>
          <TouchableOpacity style={[styles.backButton]} onPress={onBack}>
            <ArrowLeft color={colors.text} />
          </TouchableOpacity>
          <View style={styles.selectedPackageInfo}>
            <Text style={[typography.styles.t2Bold, styles.confirmTitle]}>{selectedPackage?.krLabel}</Text>
          </View>
        </View>

        <Text style={[typography.styles.t4Medium, styles.confirmDescription]}>기본 재료를 자동으로 추가할까요?</Text>

        <Card
          variant="elevated"
          padding="large"
          style={{ ...styles.ingredientsCard, ...{ backgroundColor: isDark ? colors.grey800 : colors.grey100 } }}
        >
          <View style={styles.ingredientsCardHeader}>
            <Text
              style={[
                typography.styles.t5Semibold,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              포함된 재료
            </Text>
          </View>
          <View style={styles.ingredientsGrid}>
            {selectedPackage?.ingredients.map((item, index) => {
              return (
                <Chip
                  key={index}
                  label={item.emoji + ' ' + item.name}
                  variant="secondary"
                  color="green"
                  size="medium"
                />
              );
            })}
          </View>
        </Card>

        <View style={styles.confirmButtons}>
          <Button
            onPress={onAddPackage}
            variant="primary"
            size="large"
            fullWidth
            style={{ ...styles.primaryButton, ...{ ...shadows.lg } }}
            // textStyle={{ color: colors.grey700 }}
          >
            네, 자동으로 추가할게요
          </Button>

          <Button
            onPress={onSkipPackage}
            variant="ghost"
            size="large"
            fullWidth
            style={styles.secondaryButton}
            textStyle={{ color: colors.textTertiary }}
          >
            아니요, 직접 등록할게요
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = ({
  colors,
  spacing,
  borderRadius,
}: {
  colors: ColorPalette;
  spacing: typeof import('@/lib/theme').spacing;
  borderRadius: typeof import('@/lib/theme').borderRadius;
}) =>
  StyleSheet.create({
    content: {
      flex: 1,
    },
    packageChoiceContainer: {
      flex: 1,
      paddingHorizontal: spacing.xl,
      paddingBottom: 60,
    },
    confirmHeaderSection: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.xxl,
      gap: spacing.xs,
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: borderRadius.full,
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    backButtonText: {
      color: colors.text,
      marginTop: -4,
    },
    selectedPackageInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      flex: 1,
    },
    selectedPackageIcon: {
      fontSize: 40,
    },
    confirmTitle: {
      color: colors.text,
    },
    confirmDescription: {
      color: colors.textSecondary,
      opacity: 0.9,
      marginBottom: spacing.xxxl,
    },
    ingredientsCard: {
      marginBottom: spacing.xxl,
    },
    ingredientsCardHeader: {
      marginBottom: spacing.lg,
    },

    ingredientsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    confirmButtons: {
      position: 'absolute',
      bottom: 60,
      left: 20,
      right: 20,
      gap: spacing.md,
    },
    primaryButton: {
      backgroundColor: colors.primary,
    },
    secondaryButton: {
      opacity: 0.9,
    },
  });
