import { View, Text, StyleSheet, Platform } from 'react-native';
import { useMemo } from 'react';
import { Edit3 } from 'lucide-react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTheme } from '@/lib/theme';
import Header from '@/components/ui/Header';
import FloatingButton from '@/components/ui/FloatingButton';
import SelectUnitBottomSheet from '@/components/SelectUnitBottomSheet';
import SelectDateBottomSheet from '@/components/SelectDateBottomSheet';
import EmojiBottomSheet from '@/components/EmojiBottomSheet';
import { useIngredientDetailLogic } from './hooks/useIngredientDetailLogic';
import { DetailView } from './components/DetailView';
import { EditForm } from './components/EditForm';
import { ActionButtons } from './components/ActionButtons';

export default function IngredientDetailScreen() {
  const { colors, typography, spacing } = useTheme();

  const {
    state,
    unitPicker,
    expiryDatePicker,
    purchaseDatePicker,
    isEmojiPickerVisible,
    setIsEmojiPickerVisible,
    selectedEmoji,
    handleFieldChange,
    handleDelete,
    handleConsume,
    handleUpdate,
    handleQuickSelect,
    handleEmojiSelect,
    handleBackPress,
    handleToggleEdit,
  } = useIngredientDetailLogic();

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
          contentContainerStyle={{ paddingBottom: state.isEditing ? 200 : 24 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid
          enableAutomaticScroll
          extraScrollHeight={Platform.OS === 'ios' ? 0 : 80}
          extraHeight={150}
        >
          {state.isEditing ? (
            <EditForm
              formData={state.editForm}
              selectedEmoji={selectedEmoji}
              onFieldChange={handleFieldChange}
              onEmojiPress={() => setIsEmojiPickerVisible(true)}
              onUnitPress={unitPicker.open}
              onPurchaseDatePress={() => purchaseDatePicker.open(state.editForm.purchased_date || new Date())}
              onExpiryDatePress={() => expiryDatePicker.open(state.editForm.expiry_date || new Date())}
              onQuickSelect={handleQuickSelect}
            />
          ) : (
            <>
              <DetailView ingredient={state.ingredient} />
              <ActionButtons onConsume={handleConsume} onDelete={handleDelete} />
            </>
          )}
        </KeyboardAwareScrollView>
        {state.isEditing ? (
          <FloatingButton onPress={handleUpdate} label="저장하기" hasTabBar={false} />
        ) : (
          <FloatingButton
            onPress={handleToggleEdit}
            icon={<Edit3 size={24} color="#FFFFFF" />}
            label="수정하기"
            hasTabBar={false}
          />
        )}
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
        selectedUnit={state.editForm.unit as any}
        onUnitSelect={unitPicker.handleUnitSelect}
      />

      <EmojiBottomSheet
        visible={isEmojiPickerVisible}
        onClose={() => setIsEmojiPickerVisible(false)}
        onTemplateToggle={handleEmojiSelect}
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
