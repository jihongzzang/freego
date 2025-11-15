import { View, Text, StyleSheet, Platform } from 'react-native';
import { useMemo } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTheme } from '@/lib/theme';
import Header from '@/components/ui/Header';
import FloatingButton from '@/components/ui/FloatingButton';
import SelectUnitBottomSheet from '@/components/SelectUnitBottomSheet';
import SelectDateBottomSheet from '@/components/SelectDateBottomSheet';
import EmojiBottomSheet from '@/components/EmojiBottomSheet';
import { useIngredientEditLogic } from './hooks/useIngredientEditLogic';
import { EditForm } from '@/screens/ingredient-edit/components/EditForm';
import { Save } from 'lucide-react-native';

export default function IngredientEditScreen() {
  const { colors, typography, spacing } = useTheme();

  const {
    state,
    unitPicker,
    expiryDatePicker,
    purchaseDatePicker,
    isEmojiPickerVisible,
    setIsEmojiPickerVisible,
    handleFieldChange,
    handleUpdate,
    handleQuickSelect,
    handleEmojiSelect,
    handleBackPress,
  } = useIngredientEditLogic();

  const styles = useMemo(() => createStyles({ spacing }), [spacing]);

  if (!state.ingredient) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[typography.styles.t6, { color: colors.text }]}>로딩 중이에요...</Text>
      </View>
    );
  }

  return (
    <>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="" onBackPress={handleBackPress} />
        <KeyboardAwareScrollView
          style={styles.content}
          contentContainerStyle={{ paddingBottom: 200 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid
          enableAutomaticScroll
          extraScrollHeight={Platform.OS === 'ios' ? 0 : 80}
          extraHeight={150}
        >
          <EditForm
            formData={state.editForm}
            onFieldChange={handleFieldChange}
            onEmojiPress={() => setIsEmojiPickerVisible(true)}
            onUnitPress={unitPicker.open}
            onPurchaseDatePress={() => purchaseDatePicker.open(state.editForm.purchased_date_time || new Date())}
            onExpiryDatePress={() => expiryDatePicker.open(state.editForm.expired_date_time || new Date())}
            onQuickSelect={handleQuickSelect}
          />
        </KeyboardAwareScrollView>
        <FloatingButton onPress={handleUpdate} icon={<Save size={24} color="#FFFFFF" />} hasTabBar={false} />
      </View>

      <SelectDateBottomSheet
        visible={purchaseDatePicker.visible}
        onClose={purchaseDatePicker.close}
        title="구매일 수정"
        selectedDate={purchaseDatePicker.selectedDate}
        onDateChange={purchaseDatePicker.handleDateChange}
        onConfirm={purchaseDatePicker.handleConfirm}
      />

      <SelectDateBottomSheet
        visible={expiryDatePicker.visible}
        onClose={expiryDatePicker.close}
        title="유통기한 수정"
        selectedDate={expiryDatePicker.selectedDate}
        onDateChange={expiryDatePicker.handleDateChange}
        onConfirm={expiryDatePicker.handleConfirm}
      />

      <SelectUnitBottomSheet
        visible={unitPicker.visible}
        onClose={unitPicker.close}
        selectedUnit={state.editForm.unit as any}
        onUnitSelect={unitPicker.handleUnitSelect}
      />

      <EmojiBottomSheet
        visible={isEmojiPickerVisible}
        title="이모지 수정"
        onClose={() => setIsEmojiPickerVisible(false)}
        onSelect={handleEmojiSelect}
      />
    </>
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
