import { View, StyleSheet } from 'react-native';
import { Trash2, Minus } from 'lucide-react-native';
import Button from '@/components/ui/Button';

interface ActionButtonsProps {
  onConsume: () => void;
  onDelete: () => void;
}

export function ActionButtons({ onConsume, onDelete }: ActionButtonsProps) {
  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <Button variant="primary" size="large" onPress={onConsume} leftIcon={<Minus size={20} color="#ffffff" />}>
          소모
        </Button>
      </View>
      <View style={{ flex: 1 }}>
        <Button variant="danger" size="large" onPress={onDelete} leftIcon={<Trash2 size={20} color="#ffffff" />}>
          삭제
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
