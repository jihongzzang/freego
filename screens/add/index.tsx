import { View, StyleSheet } from 'react-native';
import { useMemo } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useTheme } from '@/lib/theme';
import Header from '@/components/ui/Header';
import SelectUnitBottomSheet from '@/components/SelectUnitBottomSheet';
import SelectDateBottomSheet from '@/components/SelectDateBottomSheet';
import EmojiBottomSheet from '@/components/EmojiBottomSheet';
import { useAddLogic } from './hooks/useAddLogic';
import { AddForm } from './components/AddForm';
import { SubmitButton } from './components/SubmitButton';

export default function AddIngredientScreen() {
  const { colors, spacing } = useTheme();

  const {
    state,
    isEmojiPickerVisible,
    setIsEmojiPickerVisible,
    unitPicker,
    expiryDatePicker,
    purchaseDatePicker,
    handleFieldChange,
    handleQuickSelect,
    handleEmojiSelect,
    handleSubmit,
    handleBackPress,
  } = useAddLogic();

  const styles = useMemo(() => createStyles({ spacing }), [spacing]);

  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="" onBackPress={handleBackPress} />

        <KeyboardAwareScrollView
          style={styles.content}
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bottomOffset={180}
        >
          <AddForm
            formData={state.form}
            errors={state.errors}
            onFieldChange={handleFieldChange}
            onEmojiPress={() => setIsEmojiPickerVisible(true)}
            onUnitPress={unitPicker.open}
            onPurchaseDatePress={() => purchaseDatePicker.open(state.form.purchased_date_time || new Date())}
            onExpiryDatePress={() => expiryDatePicker.open(state.form.expired_date_time || new Date())}
            onQuickSelect={handleQuickSelect}
          />
        </KeyboardAwareScrollView>
        <SubmitButton onSubmit={handleSubmit} />
      </View>

      <SelectDateBottomSheet
        visible={purchaseDatePicker.visible}
        onClose={purchaseDatePicker.close}
        title="구매일 선택"
        selectedDate={purchaseDatePicker.selectedDate}
        onDateChange={purchaseDatePicker.handleDateChange}
        onConfirm={purchaseDatePicker.handleConfirm}
      />

      <SelectDateBottomSheet
        visible={expiryDatePicker.visible}
        onClose={expiryDatePicker.close}
        title="유통기한 선택"
        selectedDate={expiryDatePicker.selectedDate}
        onDateChange={expiryDatePicker.handleDateChange}
        onConfirm={expiryDatePicker.handleConfirm}
      />

      <SelectUnitBottomSheet
        visible={unitPicker.visible}
        onClose={unitPicker.close}
        selectedUnit={state.form.unit as any}
        onUnitSelect={unitPicker.handleUnitSelect}
      />

      <EmojiBottomSheet
        visible={isEmojiPickerVisible}
        title="이모지 선택"
        onClose={() => setIsEmojiPickerVisible(false)}
        onSelect={handleEmojiSelect}
      />
    </View>
  );
}

const createStyles = ({ spacing }: { spacing: typeof import('@/lib/theme').spacing }) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      padding: spacing.lg,
    },
  });
