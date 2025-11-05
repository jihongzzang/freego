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
import { useTheme } from '@/lib/theme';
import { useDialog } from '@/contexts/DialogContext';
import { useRouter } from '@/hooks/useRouter';
import { useMVIStore } from '@/mvi/base';
import { createAddStore } from '@/mvi/features/add';
import type { AddFormData } from '@/mvi/features/add';
import { getCategoryIcon } from '@/utils/categoryIcons';
import Header from '@/components/Header';
import BottomSheet from '@/components/BottomSheet';
import DatePicker from '@/components/DatePicker';
import {
  getTemplatesByCategory,
  type IngredientTemplate,
} from '@/utils/ingredientTemplates';
import { Ionicons } from '@expo/vector-icons';

export default function AddIngredientScreen() {
  return (
    <View style={{ flex: 1 }}>
      <AddIngredientContent />
    </View>
  );
}

function AddIngredientContent() {
  const router = useRouter();
  const { colors, typography, borderRadius, spacing } = useTheme();
  const { alert } = useDialog();
  const [state, dispatch, effect] = useMVIStore(createAddStore);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedTemplates, setSelectedTemplates] = useState<
    IngredientTemplate[]
  >([]);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 키보드 이벤트 리스너
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // 동적 스타일 생성
  const styles = useMemo(
    () => createStyles({ borderRadius, spacing }),
    [spacing, borderRadius],
  );

  // 필터링된 재료 템플릿
  const filteredTemplates = useMemo(() => {
    return getTemplatesByCategory(selectedCategory);
  }, [selectedCategory]);

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

  function handleFieldChange(field: keyof AddFormData, value: string) {
    dispatch({ type: 'UPDATE_FIELD', payload: { field, value } });
  }

  function handleSubmit() {
    dispatch({ type: 'SUBMIT_FORM' });
  }

  function handleTemplateToggle(template: IngredientTemplate) {
    setSelectedTemplates((prev) => {
      const isSelected = prev.some(
        (t) => t.name === template.name && t.category === template.category,
      );
      if (isSelected) {
        return prev.filter(
          (t) =>
            !(t.name === template.name && t.category === template.category),
        );
      } else {
        return [...prev, template];
      }
    });
  }

  async function handleConfirmTemplates() {
    if (selectedTemplates.length === 0) {
      setIsBottomSheetVisible(false);
      return;
    }

    try {
      // 선택한 템플릿들을 재고에 추가 (이름, 카테고리, 이모지)
      const { storage } = await import('@/lib/storage');
      const ingredients = selectedTemplates.map((template) => ({
        name: template.name,
        category: template.category,
        emoji: template.emoji,
        storage_location: '냉장실',
        quantity: 1,
        unit: template.defaultUnit || '개',
        expiry_date: undefined,
        memo: '',
        purchase_date: new Date().toISOString().split('T')[0],
      }));

      await storage.addMultipleIngredients(ingredients);

      // 바텀시트 닫고 상태 초기화
      setIsBottomSheetVisible(false);
      setSelectedTemplates([]);
      setSelectedCategory('전체');

      // 성공 알림
      alert({
        title: '추가 완료',
        message: `${selectedTemplates.length}개의 재료가 추가되었습니다.`,
        type: 'success',
      });
    } catch (error) {
      console.error('Error adding templates:', error);
      alert({
        title: '오류',
        message: '재료 추가 중 오류가 발생했습니다.',
        type: 'error',
      });
    }
  }

  function isTemplateSelected(template: IngredientTemplate) {
    return selectedTemplates.some(
      (t) => t.name === template.name && t.category === template.category,
    );
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
    <>
      {/* <DialogComponent /> */}
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header
          title="추가"
          onBackPress={() => dispatch({ type: 'NAVIGATE_BACK' })}
        />

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
                <Text
                  style={[
                    typography.styles.bodySemibold,
                    { color: colors.text },
                  ]}
                >
                  카테고리
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoryScrollContent}
                >
                  {[
                    '채소',
                    '과일',
                    '육류',
                    '생선류',
                    '유제품',
                    '가공식품',
                    '조미료',
                  ].map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryBtn,
                        {
                          backgroundColor: colors.surfaceSecondary,
                          borderColor: colors.surfaceSecondary,
                        },
                        state.form.category === cat && {
                          backgroundColor: colors.primaryLight,
                          borderColor: colors.primary,
                        },
                      ]}
                      onPress={() => handleFieldChange('category', cat)}
                    >
                      <View style={styles.categoryBtnContent}>
                        {getCategoryIcon(cat, 18)}
                        <Text
                          style={[
                            typography.styles.bodySemibold,
                            { color: colors.textSecondary },
                            state.form.category === cat && {
                              color: colors.primary,
                            },
                          ]}
                        >
                          {cat}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.inputGroup}>
                <Text
                  style={[
                    typography.styles.bodySemibold,
                    { color: colors.text },
                  ]}
                >
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
                  <Text
                    style={[
                      typography.styles.caption,
                      { color: colors.danger },
                    ]}
                  >
                    {state.errors.name}
                  </Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text
                  style={[
                    typography.styles.bodySemibold,
                    { color: colors.text },
                  ]}
                >
                  보관 위치
                </Text>
                <View style={styles.categoryButtons}>
                  {['냉장실', '냉동실', '실온'].map((loc) => (
                    <TouchableOpacity
                      key={loc}
                      style={[
                        styles.categoryBtn,
                        {
                          backgroundColor: colors.surfaceSecondary,
                          borderColor: colors.surfaceSecondary,
                        },
                        state.form.storage_location === loc && {
                          backgroundColor: colors.primaryLight,
                          borderColor: colors.primary,
                        },
                      ]}
                      onPress={() => handleFieldChange('storage_location', loc)}
                    >
                      <Text
                        style={[
                          typography.styles.bodySemibold,
                          { color: colors.textSecondary },
                          state.form.storage_location === loc && {
                            color: colors.primary,
                          },
                        ]}
                      >
                        {loc}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text
                  style={[
                    typography.styles.bodySemibold,
                    { color: colors.text },
                  ]}
                >
                  유통기한
                </Text>

                {/* 빠른 선택 옵션 */}
                <View style={styles.quickSelectContainer}>
                  {[
                    { label: '3일 뒤', days: 3 },
                    { label: '7일 뒤', days: 7 },
                    { label: '2주 뒤', days: 14 },
                    { label: '한달 뒤', days: 30 },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.days}
                      style={[
                        styles.quickSelectBtn,
                        {
                          backgroundColor: colors.surface,
                          borderColor: colors.border,
                        },
                      ]}
                      onPress={() => handleQuickSelect(option.days)}
                    >
                      <Text
                        style={[
                          typography.styles.caption,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* 날짜 표시 및 선택 */}
                <TouchableOpacity
                  style={[
                    styles.dateButton,
                    {
                      backgroundColor: colors.surface,
                      borderColor: state.errors.expiry_date
                        ? colors.danger
                        : colors.border,
                    },
                  ]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={colors.textSecondary}
                  />
                  <Text
                    style={[
                      typography.styles.body,
                      {
                        color: state.form.expiry_date
                          ? colors.text
                          : colors.textTertiary,
                      },
                    ]}
                  >
                    {state.form.expiry_date || '날짜 선택'}
                  </Text>
                </TouchableOpacity>

                {state.errors.expiry_date && (
                  <Text
                    style={[
                      typography.styles.caption,
                      { color: colors.danger },
                    ]}
                  >
                    {state.errors.expiry_date}
                  </Text>
                )}
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text
                    style={[
                      typography.styles.bodySemibold,
                      { color: colors.text },
                    ]}
                  >
                    수량
                  </Text>
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
                <View
                  style={[
                    styles.inputGroup,
                    { flex: 1, marginLeft: spacing.md },
                  ]}
                >
                  <Text
                    style={[
                      typography.styles.bodySemibold,
                      { color: colors.text },
                    ]}
                  >
                    단위
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: colors.surface,
                        color: colors.text,
                        borderColor: colors.border,
                      },
                    ]}
                    value={state.form.unit}
                    onChangeText={(text) => handleFieldChange('unit', text)}
                    placeholder="개, g, ml"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text
                  style={[
                    typography.styles.bodySemibold,
                    { color: colors.text },
                  ]}
                >
                  메모
                </Text>
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
              style={[
                styles.submitButton,
                { backgroundColor: colors.primary },
                state.isSubmitting && { opacity: 0.6 },
              ]}
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

      {!isKeyboardVisible && !isBottomSheetVisible && (
        <TouchableOpacity
          style={[
            styles.floatingButton,
            {
              backgroundColor: colors.primary,
              bottom: (insets.bottom || spacing.md) + 20 + 56 + 16,
            },
          ]}
          onPress={() => setIsBottomSheetVisible(true)}
        >
          <Ionicons name="grid" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      {/* DatePicker BottomSheet */}
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
            style={[
              styles.datePickerConfirm,
              { backgroundColor: colors.primary },
            ]}
            onPress={() => setShowDatePicker(false)}
          >
            <Text style={[typography.styles.button, { color: '#FFFFFF' }]}>
              확인
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </BottomSheet>

      {/* Templates BottomSheet */}
      <BottomSheet
        maxHeight={600}
        visible={isBottomSheetVisible}
        onClose={() => {
          setIsBottomSheetVisible(false);
          setSelectedTemplates([]);
          setSelectedCategory('전체');
        }}
        title="재료 여러개 추가하기"
      >
        <View style={styles.bottomSheetContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            style={{ flex: 1 }}
          >
            <View style={styles.bottomSheetContent}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryTabsScroll}
              >
                {[
                  '전체',
                  '채소',
                  '과일',
                  '육류',
                  '생선류',
                  '유제품',
                  '가공식품',
                  '조미료',
                ].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryTab,
                      {
                        backgroundColor:
                          selectedCategory === cat
                            ? colors.primaryLight
                            : colors.surface,
                        borderColor:
                          selectedCategory === cat
                            ? colors.primary
                            : colors.border,
                      },
                    ]}
                    onPress={() => setSelectedCategory(cat)}
                  >
                    {cat !== '전체' && getCategoryIcon(cat, 16)}
                    <Text
                      style={[
                        typography.styles.body,
                        {
                          color:
                            selectedCategory === cat
                              ? colors.primary
                              : colors.textSecondary,
                        },
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={styles.templatesGrid}>
                {filteredTemplates.map((template, index) => {
                  const isSelected = isTemplateSelected(template);
                  return (
                    <TouchableOpacity
                      key={`${template.category}-${template.name}-${index}`}
                      style={[
                        styles.templateItem,
                        {
                          backgroundColor: isSelected
                            ? colors.primaryLight
                            : colors.surface,
                          borderColor: isSelected
                            ? colors.primary
                            : colors.border,
                          borderWidth: isSelected ? 2 : 1,
                        },
                      ]}
                      onPress={() => handleTemplateToggle(template)}
                    >
                      <Text style={styles.templateEmoji}>{template.emoji}</Text>
                      <Text
                        style={[
                          typography.styles.caption,
                          {
                            color: isSelected ? colors.primary : colors.text,
                            fontWeight: isSelected ? '600' : '400',
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {template.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {selectedTemplates.length > 0 && (
            <View
              style={[
                styles.confirmButtonContainer,
                {
                  backgroundColor: colors.background,
                  borderTopColor: colors.border,
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  { backgroundColor: colors.primary },
                ]}
                onPress={handleConfirmTemplates}
              >
                <Text style={[typography.styles.button, { color: '#FFFFFF' }]}>
                  {selectedTemplates.length}개 추가하기
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </BottomSheet>
    </>
  );
}

const createStyles = ({
  borderRadius,
  spacing,
}: {
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
      borderTopColor: '#E5E7EB',
    },
    floatingButton: {
      position: 'absolute',
      right: spacing.xl,
      bottom: spacing.xl,
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    bottomSheetContainer: {
      flex: 1,
      maxHeight: 600,
    },
    bottomSheetContent: {
      padding: spacing.md,
      gap: spacing.lg,
      paddingBottom: 20,
    },
    confirmButtonContainer: {
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
      borderTopWidth: 1,
    },
    confirmButton: {
      paddingVertical: spacing.lg,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      width: '100%',
    },
    categoryTabs: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    categoryTabsScroll: {
      gap: spacing.sm,
    },
    categoryTab: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs + 2,
      borderRadius: borderRadius.xl,
      borderWidth: 1,
    },
    templatesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: spacing.xs,
    },
    templateItem: {
      width: '31%',
      alignItems: 'center',
      gap: spacing.xs,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      borderRadius: borderRadius.md,
      borderWidth: 1,
    },
    templateEmoji: {
      fontSize: 16,
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
  });
