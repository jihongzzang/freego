import { View, StyleSheet, Platform } from 'react-native';
import { useMemo } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTheme } from '@/lib/theme';
import Header from '@/components/ui/Header';
import SelectUnitBottomSheet from '@/components/SelectUnitBottomSheet';
import SelectDateBottomSheet from '@/components/SelectDateBottomSheet';
import AddEmojiBottomSheet from '@/components/AddEmojiBottomSheet';
import { useAddLogic } from './hooks/useAddLogic';
import { AddForm } from './components/AddForm';
import { SubmitButton } from './components/SubmitButton';

export default function AddIngredientScreen() {
  const { colors, spacing } = useTheme();

  const {
    state,
    isEmojiPickerVisible,
    setIsEmojiPickerVisible,
    selectedEmoji,
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
          contentContainerStyle={{ paddingBottom: spacing.xxxl }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid={true}
          enableAutomaticScroll
          extraScrollHeight={Platform.OS === 'ios' ? 0 : 80}
          extraHeight={150}
          enableResetScrollToCoords={false}
        >
          <AddForm
            formData={state.form}
            errors={state.errors}
            selectedEmoji={selectedEmoji}
            onFieldChange={handleFieldChange}
            onEmojiPress={() => setIsEmojiPickerVisible(true)}
            onUnitPress={unitPicker.open}
            onPurchaseDatePress={() => purchaseDatePicker.open(state.form.purchased_date || new Date())}
            onExpiryDatePress={() => expiryDatePicker.open(state.form.expiry_date || new Date())}
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

      <AddEmojiBottomSheet
        visible={isEmojiPickerVisible}
        onClose={() => setIsEmojiPickerVisible(false)}
        selectedCategoryId={state.form.category}
        selectedTemplates={selectedEmoji ? [selectedEmoji] : []}
        onTemplateToggle={handleEmojiSelect}
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
