import { View, Text, StyleSheet } from 'react-native';
import { Info } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import Card from '@/components/ui/Card';
import { List, ListItem } from '@/components/ui/List';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface AppInfoProps {
  onOpenPrivacyPolicy: () => void;
  onOpenTermsOfService: () => void;
  onRateApp: () => void;
}

export function AppInfo({ onOpenPrivacyPolicy, onOpenTermsOfService, onRateApp }: AppInfoProps) {
  const { t } = useTranslation();
  const { colors, typography, spacing } = useTheme();

  const styles = useMemo(() => createStyles({ spacing }), [spacing]);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Info size={20} color={colors.textSecondary} />
        <Text style={[typography.styles.t4Semibold, { color: colors.text }]}>{t('settings.appInfo.title')}</Text>
      </View>

      <Card variant="elevated" padding="none">
        <List>
          <ListItem title={t('settings.appInfo.version')} rightText="1.0.0" />
          <ListItem title={t('settings.appInfo.developer')} rightText={t('settings.appInfo.developerName')} />
          <ListItem title={t('settings.appInfo.contact')} rightText="jujihong2@gmail.com" />
          <ListItem title={t('settings.appInfo.privacyPolicy')} showChevron onPress={onOpenPrivacyPolicy} />
          <ListItem title={t('settings.appInfo.termsOfService')} showChevron onPress={onOpenTermsOfService} />
          <ListItem title={t('settings.appInfo.rateApp')} showChevron onPress={onRateApp} />
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
