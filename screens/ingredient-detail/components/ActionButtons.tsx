import { View, StyleSheet } from 'react-native';
import Button from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';

interface ActionButtonsProps {
  onConsume: () => void;
  onDelete: () => void;
}

export function ActionButtons({ onConsume, onDelete }: ActionButtonsProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <Button variant="primary" size="large" onPress={onConsume}>
          {t('common.consume')}
        </Button>
      </View>
      <View style={{ flex: 1 }}>
        <Button variant="danger" size="large" onPress={onDelete}>
          {t('common.delete')}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },
});
