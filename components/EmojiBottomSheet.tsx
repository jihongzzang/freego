import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useTheme } from '@/lib/theme';
import BottomSheet from '@/components/ui/BottomSheet';
import { ALL_ROUTINE_FOOD_EMOJI } from '@/constants/emojiTemplate';

interface EmojiBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (emoji: string) => void;
}

export default function EmojiBottomSheet({ visible, onClose, onSelect }: EmojiBottomSheetProps) {
  const { spacing } = useTheme();

  const list = ALL_ROUTINE_FOOD_EMOJI;

  const screenWidth = Dimensions.get('window').width;
  const H_PADDING = spacing.xl * 2;
  const GAP = 8;
  const NUM_COLUMNS = 8;

  // 약간의 여유 공간 추가
  const ITEM_WIDTH = (screenWidth - H_PADDING - GAP * (NUM_COLUMNS - 1) - 24) / NUM_COLUMNS;

  return (
    <BottomSheet maxHeight={450} visible={visible} onClose={onClose} title="이모지 추가">
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: spacing.xl, paddingTop: 12, paddingBottom: 0 }}
        >
          <View style={styles.grid}>
            {list.map((emoji) => (
              <TouchableOpacity
                key={emoji}
                style={[styles.templateItem, { width: ITEM_WIDTH }]}
                onPress={() => onSelect(emoji)}
              >
                <Text style={{ fontSize: 24 }}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  templateItem: {
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
