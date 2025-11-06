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
import BottomSheet from '@/components/BottomSheet';
import DatePicker from '@/components/DatePicker';
import { Ionicons } from '@expo/vector-icons';
import { UNITS, findUnitById } from '@/constants/units';
import { CATEGORIES, ALL_CATEGORY } from '@/constants/categories';
import { STORAGE_LOCATIONS } from '@/constants/storageLocations';
import { QUICK_SELECT_OPTIONS } from '@/constants/quickSelectOptions';

export default function AddIngredientScreen() {
  const router = useRouter();
  const { category } = useLocalSearchParams<{ category?: string }>();
  const { colors, typography, borderRadius, spacing } = useTheme();
  const { alert } = useDialog();
  const [state, dispatch, effect] = useMVIStore(createAddStore);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPurchaseDatePicker, setShowPurchaseDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showUnitPicker, setShowUnitPicker] = useState(false);

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

  function handleSubmit() {
    dispatch({ type: 'SUBMIT_FORM' });
  }

  // 날짜 변경 핸들러
  function handleDateChange(date: Date) {
    setSelectedDate(date);
    // 로컬 타임존을 유지하면서 YYYY-MM-DD 포맷으로 변환
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    handleFieldChange('expiry_date', formattedDate);
  }

  // 빠른 선택 핸들러
  function handleQuickSelect(days: number) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    setSelectedDate(date);
    // 로컬 타임존을 유지하면서 YYYY-MM-DD 포맷으로 변환
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    handleFieldChange('expiry_date', formattedDate);
    setShowDatePicker(false);
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
                              color: colors.primary,
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
                <Text style={[typography.styles.bodySemibold, { color: colors.text }]}>
                  이름 <Text style={{ color: colors.danger }}>*</Text>
                </Text>
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
                            color: colors.primary,
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

                  {/* 등록일과 동일 체크박스 */}
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
                          borderColor: colors.border,
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

                {/* 날짜 선택 버튼 */}
                <TouchableOpacity
                  style={[
                    styles.dateButton,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => setShowPurchaseDatePicker(true)}
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

                {/* 빠른 선택 옵션 */}
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

                {/* 날짜 표시 및 선택 */}
                <TouchableOpacity
                  style={[
                    styles.dateButton,
                    {
                      backgroundColor: colors.surface,
                      borderColor: state.errors.expiry_date ? colors.danger : colors.border,
                    },
                  ]}
                  onPress={() => setShowDatePicker(true)}
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
                    onPress={() => setShowUnitPicker(true)}
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
                    <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
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

      {/* Purchase DatePicker BottomSheet */}
      <BottomSheet
        maxHeight={600}
        visible={showPurchaseDatePicker}
        onClose={() => setShowPurchaseDatePicker(false)}
        title="구매일 선택"
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.datePickerBottomSheet}
          showsVerticalScrollIndicator={false}
        >
          <DatePicker
            value={state.form.purchase_date ? new Date(state.form.purchase_date) : new Date()}
            onDateSelect={(date) => {
              handleFieldChange('purchase_date', date.toISOString().split('T')[0]);
            }}
          />
          <TouchableOpacity
            style={[styles.datePickerConfirm, { backgroundColor: colors.primary }]}
            onPress={() => setShowPurchaseDatePicker(false)}
          >
            <Text style={[typography.styles.button, { color: '#FFFFFF' }]}>확인</Text>
          </TouchableOpacity>
        </ScrollView>
      </BottomSheet>

      {/* Expiry DatePicker BottomSheet */}
      <BottomSheet
        maxHeight={600}
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        title="유통기한 선택"
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.datePickerBottomSheet}
          showsVerticalScrollIndicator={false}
        >
          <DatePicker value={selectedDate} onDateSelect={handleDateChange} />
          <TouchableOpacity
            style={[styles.datePickerConfirm, { backgroundColor: colors.primary }]}
            onPress={() => setShowDatePicker(false)}
          >
            <Text style={[typography.styles.button, { color: '#FFFFFF' }]}>확인</Text>
          </TouchableOpacity>
        </ScrollView>
      </BottomSheet>

      <BottomSheet maxHeight={400} visible={showUnitPicker} onClose={() => setShowUnitPicker(false)} title="단위 선택">
        <View style={styles.unitPickerContainer}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.unitPickerContent}>
            {UNITS.map((unit) => (
              <TouchableOpacity
                key={unit.id}
                style={[
                  styles.unitItem,
                  {
                    backgroundColor: state.form.unit === unit.id ? colors.primaryLight : colors.surface,
                    borderColor: state.form.unit === unit.id ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => {
                  handleFieldChange('unit', unit.id);
                  setShowUnitPicker(false);
                }}
              >
                <Text
                  style={[
                    typography.styles.bodyMedium,
                    {
                      color: state.form.unit === unit.id ? colors.primary : colors.text,
                    },
                  ]}
                >
                  {unit.krLabel}
                </Text>
                {state.form.unit === unit.id && <Ionicons name="checkmark" size={20} color={colors.primary} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </BottomSheet>
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
    submitButton: {
      paddingVertical: spacing.lg,
      borderRadius: borderRadius.md,
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
    unitPickerContainer: {
      flex: 1,
      maxHeight: 400,
    },
    unitPickerContent: {
      padding: spacing.md,
      gap: spacing.xs,
    },
    unitItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.md,
      borderWidth: 1,
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
  });
