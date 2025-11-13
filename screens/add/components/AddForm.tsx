import { View, StyleSheet } from 'react-native';
import { AddFormData } from '@/mvi/features/add';
import { BasicInfoSection } from '../../ingredient-edit/components/EditForm/BasicInfoSection';
import { CategorySection } from '../../ingredient-edit/components/EditForm/CategorySection';
import { QuantitySection } from '../../ingredient-edit/components/EditForm/QuantitySection';
import { DateSection } from '../../ingredient-edit/components/EditForm/DateSection';
import { StorageSection } from '../../ingredient-edit/components/EditForm/StorageSection';
import { MemoSection } from '@/screens/ingredient-edit/components/EditForm/MemoSection';
import { useTheme } from '@/lib/theme';
import { useMemo } from 'react';

interface AddFormProps {
  formData: AddFormData;
  errors: Partial<Record<keyof AddFormData, string>>;
  onFieldChange: (field: keyof AddFormData, value: string) => void;
  onEmojiPress: () => void;
  onUnitPress: () => void;
  onPurchaseDatePress: () => void;
  onExpiryDatePress: () => void;
  onQuickSelect: (days: number) => void;
}

export function AddForm({
  formData,
  onFieldChange,
  onEmojiPress,
  onUnitPress,
  onPurchaseDatePress,
  onExpiryDatePress,
  onQuickSelect,
}: AddFormProps) {
  const { spacing } = useTheme();

  const styles = useMemo(() => createStyles({ spacing }), [spacing]);

  return (
    <View style={styles.container}>
      <CategorySection selectedCategory={formData.category} onCategoryChange={onFieldChange as any} />
      <BasicInfoSection
        formData={formData as any}
        selectedEmoji={formData.emoji}
        onFieldChange={onFieldChange as any}
        onEmojiPress={onEmojiPress}
      />
      <StorageSection storageLocation={formData.storage_location} onFieldChange={onFieldChange as any} />
      <DateSection
        isEdit={false}
        purchaseDate={formData.purchased_date_time}
        expiryDate={formData.expired_date_time}
        onFieldChange={onFieldChange as any}
        onPurchaseDatePress={onPurchaseDatePress}
        onExpiryDatePress={onExpiryDatePress}
        onQuickSelect={onQuickSelect}
      />
      <QuantitySection
        quantity={formData.quantity}
        unit={formData.unit}
        onFieldChange={onFieldChange as any}
        onUnitPress={onUnitPress}
      />
      <MemoSection memo={formData.memo || ''} onFieldChange={onFieldChange as any} />
    </View>
  );
}

const createStyles = ({ spacing }: { spacing: typeof import('@/lib/theme').spacing }) =>
  StyleSheet.create({
    container: {
      gap: spacing.xxl,
    },
  });
