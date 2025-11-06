import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ColorPalette, useTheme } from '@/lib/theme';
import { useDialog } from '@/contexts/DialogContext';
import { useRouter } from '@/hooks/useRouter';
import { useMVIStore } from '@/mvi/base';
import { createAddStore } from '@/mvi/features/add';
import type { AddFormData } from '@/mvi/features/add';
import { getCategoryIcon } from '@/utils/getCategoryIcons';
import Header from '@/components/Header';
import SelectUnitBottomSheet from '@/components/SelectUnitBottomSheet';
import SelectDateBottomSheet from '@/components/SelectDateBottomSheet';
import { Ionicons } from '@expo/vector-icons';
import { findUnitById } from '@/constants/units';
import { CATEGORIES, ALL_CATEGORY } from '@/constants/categories';
import { STORAGE_LOCATIONS } from '@/constants/storageLocations';
import { QUICK_SELECT_OPTIONS } from '@/constants/quickSelectOptions';
import { useUnitPicker } from '@/hooks/useUnitPicker';
import { useExpiryDatePicker } from '@/hooks/useExpiryDatePicker';
import { usePurchaseDatePicker } from '@/hooks/usePurchateDatePicker';
import { type IngredientTemplate } from '@/constants/ingredientTemplates';
import AddEmojiBottomSheet from '@/components/AddEmojiBottomSheet';

export default function AddIngredientScreen() {
  const router = useRouter();
  const { category } = useLocalSearchParams<{ category?: string }>();
  const { colors, typography, borderRadius, spacing } = useTheme();
  const { alert } = useDialog();
  const [state, dispatch, effect] = useMVIStore(createAddStore);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<IngredientTemplate | null>(null);
  const insets = useSafeAreaInsets();

  const unitPicker = useUnitPicker({
    onUnitChange: (unitId) => handleFieldChange('unit', unitId),
  });

  // 유통기한 선택 훅
  const expiryDatePicker = useExpiryDatePicker({
    onDateConfirm: (formattedDate) => handleFieldChange('expiry_date', formattedDate),
  });

  // 구매일 선택 훅
  const purchaseDatePicker = usePurchaseDatePicker({
    onDateConfirm: (formattedDate) => handleFieldChange('purchase_date', formattedDate),
  });

  // 키보드 이벤트 리스너
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // 동적 스타일 생성
  const styles = useMemo(() => createStyles({ colors, borderRadius, spacing }), [spacing, borderRadius]);

  // Effect 처리
  useEffect(() => {
    if (!effect) return;

    switch (effect.type) {
      case 'SHOW_ALERT':
        alert({
          title: effect.payload.title,
          message: effect.payload.message,
          type: effect.payload.variant,
        });
        break;

      case 'NAVIGATE_HOME':
        router.push('/(tabs)');
        break;

      case 'NAVIGATE_BACK':
        router.back();
        break;
    }
  }, [effect]);

  // 초기 모드 설정
  useEffect(() => {
    if (state.mode === 'select') {
      dispatch({ type: 'SET_MODE', payload: 'manual' });
    }
  }, [state.mode]);

  // URL 파라미터로 전달된 카테고리를 초기값으로 설정
  useEffect(() => {
    if (category && category !== ALL_CATEGORY.id) {
      handleFieldChange('category', category);
    }
  }, [category]);

  function handleFieldChange(field: keyof AddFormData, value: string) {
    console.log(field, value);
    dispatch({ type: 'UPDATE_FIELD', payload: { field, value } });
  }

  // 빠른 선택 핸들러
  function handleQuickSelect(days: number) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    handleFieldChange('expiry_date', formattedDate);
  }

  function handleEmojiSelect(template: IngredientTemplate) {
    setSelectedEmoji(template);
    handleFieldChange('emoji', template.emoji);
    setIsEmojiPickerVisible(false);
  }

  // function handleEmojiConfirm() {
  //   setIsEmojiPickerVisible(false);
  // }

  function handleSubmit() {
    dispatch({ type: 'SUBMIT_FORM' });
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="" onBackPress={() => dispatch({ type: 'NAVIGATE_BACK' })} />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <ScrollView
            style={styles.content}
            contentContainerStyle={{ paddingBottom: spacing.xxxl }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
          >
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={[typography.styles.bodySemibold, { color: colors.text }]}>카테고리</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoryScrollContent}
                >
                  {CATEGORIES.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.categoryBtn,
                        {
                          backgroundColor: colors.surfaceSecondary,
                          borderColor: colors.surfaceSecondary,
                        },
                        state.form.category === cat.id && {
                          backgroundColor: colors.primaryLight,
                          borderColor: colors.primary,
                        },
                      ]}
                      onPress={() => handleFieldChange('category', cat.id)}
                    >
                      <View style={styles.categoryBtnContent}>
                        {getCategoryIcon(cat.id, 18)}
                        <Text
                          style={[
                            typography.styles.bodySemibold,
                            { color: colors.textSecondary },
                            state.form.category === cat.id && {
                              color: colors.white,
                            },
                          ]}
                        >
                          {cat.krLabel}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.inputHeader}>
                  <Text style={[typography.styles.bodySemibold, { color: colors.text }]}>
                    이름 <Text style={{ color: colors.danger }}>*</Text>
                  </Text>
                  <TouchableOpacity style={styles.emojiButton} onPress={() => setIsEmojiPickerVisible(true)}>
                    {selectedEmoji ? (
                      <View style={styles.emojiButtonContent}>
                        <Text style={typography.styles.bodySmall}>{selectedEmoji.emoji}</Text>
                        <Text style={[typography.styles.bodySmall, { color: colors.textTertiary }]}>+</Text>
                      </View>
                    ) : (
                      <Text style={[typography.styles.bodySmall, { color: colors.textTertiary }]}>이모지 +</Text>
                    )}
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.surface,
                      color: colors.text,
                      borderColor: colors.border,
                    },
                    state.errors.name && { borderColor: colors.danger },
                  ]}
                  value={state.form.name}
                  onChangeText={(text) => handleFieldChange('name', text)}
                  placeholder="기억하고 싶은 재료 이름"
                  placeholderTextColor={colors.textTertiary}
                />
                {state.errors.name && (
                  <Text style={[typography.styles.caption, { color: colors.danger }]}>{state.errors.name}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={[typography.styles.bodySemibold, { color: colors.text }]}>보관 위치</Text>
                <View style={styles.categoryButtons}>
                  {STORAGE_LOCATIONS.map((loc) => (
                    <TouchableOpacity
                      key={loc.id}
                      style={[
                        styles.categoryBtn,
                        {
                          backgroundColor: colors.surfaceSecondary,
                          borderColor: colors.surfaceSecondary,
                        },
                        state.form.storage_location === loc.id && {
                          backgroundColor: colors.primaryLight,
                          borderColor: colors.primary,
                        },
                      ]}
                      onPress={() => handleFieldChange('storage_location', loc.id)}
                    >
                      <Text
                        style={[
                          typography.styles.bodySemibold,
                          { color: colors.textSecondary },
                          state.form.storage_location === loc.id && {
                            color: colors.white,
                          },
                        ]}
                      >
                        {loc.krLabel}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <View style={[styles.row, { justifyContent: 'space-between', alignItems: 'center' }]}>
                  <Text style={[typography.styles.bodySemibold, { color: colors.text }]}>구매일</Text>

                  <TouchableOpacity
                    style={styles.checkboxRow}
                    onPress={() => {
                      if (state.form.purchase_date) {
                        // 이미 선택된 경우 undefined로 초기화
                        handleFieldChange('purchase_date', '');
                      } else {
                        // 등록일과 동일하게 설정 (오늘)
                        handleFieldChange('purchase_date', new Date().toISOString().split('T')[0]);
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        {
                          borderColor:
                            state.form.purchase_date === new Date().toISOString().split('T')[0]
                              ? colors.primary
                              : colors.border,
                          backgroundColor:
                            state.form.purchase_date === new Date().toISOString().split('T')[0]
                              ? colors.primary
                              : 'transparent',
                        },
                      ]}
                    >
                      {state.form.purchase_date === new Date().toISOString().split('T')[0] && (
                        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                      )}
                    </View>
                    <Text style={[typography.styles.bodySmall, { color: colors.textSecondary }]}>등록일과 동일</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[
                    styles.dateButton,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => purchaseDatePicker.open(state.form.purchase_date || new Date())}
                >
                  <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
                  <Text
                    style={[
                      typography.styles.body,
                      {
                        color: state.form.purchase_date ? colors.text : colors.textTertiary,
                      },
                    ]}
                  >
                    {state.form.purchase_date || '날짜 선택'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[typography.styles.bodySemibold, { color: colors.text }]}>유통기한</Text>

                <View style={styles.quickSelectContainer}>
                  {QUICK_SELECT_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.quickSelectBtn,
                        {
                          backgroundColor: colors.surface,
                          borderColor: colors.border,
                        },
                      ]}
                      onPress={() => handleQuickSelect(option.days)}
                    >
                      <Text style={[typography.styles.caption, { color: colors.textSecondary }]}>{option.krLabel}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity
                  style={[
                    styles.dateButton,
                    {
                      backgroundColor: colors.surface,
                      borderColor: state.errors.expiry_date ? colors.danger : colors.border,
                    },
                  ]}
                  onPress={() => expiryDatePicker.open(state.form.expiry_date || new Date())}
                >
                  <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
                  <Text
                    style={[
                      typography.styles.body,
                      {
                        color: state.form.expiry_date ? colors.text : colors.textTertiary,
                      },
                    ]}
                  >
                    {state.form.expiry_date || '날짜 선택'}
                  </Text>
                </TouchableOpacity>

                {state.errors.expiry_date && (
                  <Text style={[typography.styles.caption, { color: colors.danger }]}>{state.errors.expiry_date}</Text>
                )}
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={[typography.styles.bodySemibold, { color: colors.text }]}>수량</Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: colors.surface,
                        color: colors.text,
                        borderColor: colors.border,
                      },
                    ]}
                    value={state.form.quantity}
                    onChangeText={(text) => handleFieldChange('quantity', text)}
                    keyboardType="numeric"
                    placeholder="입력"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: spacing.md }]}>
                  <Text style={[typography.styles.bodySemibold, { color: colors.text }]}>단위</Text>
                  <TouchableOpacity
                    style={[
                      styles.input,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      },
                    ]}
                    onPress={unitPicker.open}
                  >
                    <Text
                      style={[
                        typography.styles.body,
                        {
                          color: state.form.unit ? colors.text : colors.textTertiary,
                        },
                      ]}
                    >
                      {state.form.unit ? findUnitById(state.form.unit)?.krLabel || state.form.unit : '선택'}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color={colors.textTertiary} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[typography.styles.bodySemibold, { color: colors.text }]}>메모</Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.textArea,
                    {
                      backgroundColor: colors.surface,
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  value={state.form.memo}
                  onChangeText={(text) => handleFieldChange('memo', text)}
                  placeholder="특별히 기억하고 싶은 내용이 있나요?"
                  placeholderTextColor={colors.textTertiary}
                  multiline
                  numberOfLines={4}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {!isKeyboardVisible && (
          <View
            style={[
              styles.bottomBar,
              {
                backgroundColor: colors.background,
                paddingBottom: insets.bottom || spacing.md,
              },
            ]}
          >
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: colors.primary }, state.isSubmitting && { opacity: 0.6 }]}
              onPress={handleSubmit}
              disabled={state.isSubmitting}
            >
              <Text style={[typography.styles.button, { color: '#FFFFFF' }]}>
                {state.isSubmitting ? '추가 중...' : '추가할게요'}
              </Text>
            </TouchableOpacity>
          </View>
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
        selectedUnit={state.form.unit as any}
        onUnitSelect={unitPicker.handleUnitSelect}
      />

      <AddEmojiBottomSheet
        visible={isEmojiPickerVisible}
        onClose={() => setIsEmojiPickerVisible(false)}
        selectedCategoryId={state.form.category}
        selectedTemplates={selectedEmoji ? [selectedEmoji] : []}
        onTemplateToggle={handleEmojiSelect}
        // onConfirm={handleEmojiConfirm}
      />
    </View>
  );
}

const createStyles = ({
  colors,
  borderRadius,
  spacing,
}: {
  colors: ColorPalette;
  borderRadius: typeof import('@/lib/theme').borderRadius;
  spacing: typeof import('@/lib/theme').spacing;
}) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      padding: spacing.lg,
    },
    form: {
      gap: spacing.xxl,
      paddingBottom: 84,
    },
    inputGroup: {
      gap: spacing.sm,
    },
    input: {
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: 14,
      fontSize: 16,
      borderWidth: 1,
    },
    textArea: {
      height: 100,
      textAlignVertical: 'top',
    },
    row: {
      flexDirection: 'row',
    },
    categoryButtons: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    categoryScrollContent: {
      gap: spacing.sm,
    },
    categoryBtn: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs + 2,
      borderRadius: borderRadius.xl,
      borderWidth: 1,
    },
    categoryBtnContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    emojiSelectButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
      paddingVertical: 14,
      borderRadius: borderRadius.md,
      borderWidth: 1,
    },
    emojiSelectContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    selectedEmojiText: {
      fontSize: 24,
    },
    submitButton: {
      paddingVertical: spacing.lg,
      borderRadius: borderRadius.xl,
      alignItems: 'center',
      width: '100%',
    },
    bottomBar: {
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.borderLight,
    },
    quickSelectContainer: {
      flexDirection: 'row',
      gap: spacing.xs,
      flexWrap: 'wrap',
    },
    quickSelectBtn: {
      flex: 1,
      minWidth: '22%',
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs + 2,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      alignItems: 'center',
    },
    dateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingHorizontal: spacing.lg,
      paddingVertical: 14,
      borderRadius: borderRadius.md,
      borderWidth: 1,
    },
    datePickerBottomSheet: {
      padding: spacing.lg,
      gap: spacing.lg,
    },
    datePickerConfirm: {
      paddingVertical: spacing.md,
      borderRadius: borderRadius.md,
      alignItems: 'center',
    },
    checkboxRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    checkboxButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: 14,
      borderRadius: borderRadius.md,
      borderWidth: 1,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 4,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    emojiButton: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    emojiButtonContent: {
      width: 48,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
    },
  });
