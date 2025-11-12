import { View, StyleSheet } from 'react-native';
import { EditFormData } from '@/mvi/features/ingredient-detail';

import { BasicInfoSection } from './BasicInfoSection';
import { CategorySection } from './CategorySection';
import { QuantitySection } from './QuantitySection';
import { DateSection } from './DateSection';
import { StorageSection } from './StorageSection';
import { MemoSection } from './MemoSection';
import { useMemo } from 'react';
import { useTheme } from '@/lib/theme';

interface EditFormProps {
  formData: EditFormData;
  selectedEmoji: string | null;
  onFieldChange: (field: keyof EditFormData, value: any) => void;
  onEmojiPress: () => void;
  onUnitPress: () => void;
  onPurchaseDatePress: () => void;
  onExpiryDatePress: () => void;
  onQuickSelect: (days: number) => void;
}

export function EditForm({
  formData,
  selectedEmoji,
  onFieldChange,
  onEmojiPress,
  onUnitPress,
  onPurchaseDatePress,
  onExpiryDatePress,
  onQuickSelect,
}: EditFormProps) {
  const { spacing } = useTheme();

  const styles = useMemo(() => createStyles({ spacing }), [spacing]);

  return (
    <View style={styles.container}>
      <BasicInfoSection
        formData={formData}
        selectedEmoji={selectedEmoji}
        onFieldChange={onFieldChange}
        onEmojiPress={onEmojiPress}
      />

      <CategorySection selectedCategory={formData.category} onCategoryChange={onFieldChange} />

      <QuantitySection
        quantity={formData.quantity}
        unit={formData.unit}
        onFieldChange={onFieldChange}
        onUnitPress={onUnitPress}
      />

      <DateSection
        isEdit
        purchaseDate={formData.purchased_date}
        expiryDate={formData.expiry_date}
        onFieldChange={onFieldChange}
        onPurchaseDatePress={onPurchaseDatePress}
        onExpiryDatePress={onExpiryDatePress}
        onQuickSelect={onQuickSelect}
      />

      <StorageSection storageLocation={formData.storage_location} onFieldChange={onFieldChange} />

      <MemoSection memo={formData.memo || ''} onFieldChange={onFieldChange} />
    </View>
  );
}

const createStyles = ({ spacing }: { spacing: typeof import('@/lib/theme').spacing }) =>
  StyleSheet.create({
    container: {
      gap: spacing.xxl,
    },
  });
