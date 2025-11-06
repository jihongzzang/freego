import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
} from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Trash2, Edit3, Minus, Check } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';
import { ColorPalette, useTheme } from '@/lib/theme';
import { useDialog } from '@/contexts/DialogContext';
import { useRouter } from '@/hooks/useRouter';
import { useMVIStore } from '@/mvi/base';
import { createIngredientDetailStore, EditFormData } from '@/mvi/features/ingredient-detail';
import { getCategoryIcon } from '@/utils/getCategoryIcons';
import { getStatusColor } from '@/utils/getStatusColors';
import { CATEGORIES, findCategoryById } from '@/constants/categories';
import { STORAGE_LOCATIONS, findStorageLocationById } from '@/constants/storageLocations';
import { QUICK_SELECT_OPTIONS } from '@/constants/quickSelectOptions';
import { findStatusById } from '@/constants/itemStatus';
import { findUnitById } from '@/constants/units';
import Header from '@/components/Header';
import FloatingButton from '@/components/FloatingButton';
import SelectUnitBottomSheet from '@/components/SelectUnitBottomSheet';
import SelectDateBottomSheet from '@/components/SelectDateBottomSheet';
import { useUnitPicker } from '@/hooks/useUnitPicker';
import { useExpiryDatePicker } from '@/hooks/useExpiryDatePicker';
import { type IngredientTemplate } from '@/constants/ingredientTemplates';
import AddEmojiBottomSheet from '@/components/AddEmojiBottomSheet';

export default function IngredientDetailScreen() {
  const router = useRouter();
  const { colors, typography, spacing, borderRadius } = useTheme();
  const { id, mode } = useLocalSearchParams();
  const { alert, confirm } = useDialog();
  const [state, dispatch, effect] = useMVIStore(createIngredientDetailStore);
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<IngredientTemplate | null>(null);

  const unitPicker = useUnitPicker({
    onUnitChange: (unitId) => handleFieldChange('unit', unitId),
  });

  // 유통기한 선택 훅
  const expiryDatePicker = useExpiryDatePicker({
    onDateConfirm: (formattedDate) => handleFieldChange('expiry_date', formattedDate),
  });

  // 구매일 선택 훅
  const purchaseDatePicker = useExpiryDatePicker({
    onDateConfirm: (formattedDate) => handleFieldChange('purchase_date', formattedDate),
  });

  const styles = useMemo(() => createStyles({ colors, spacing, borderRadius }), [spacing, borderRadius]);

  // 식재료 데이터 로드
  useEffect(() => {
    if (id) {
      dispatch({ type: 'LOAD_INGREDIENT', payload: id as string });
    }
  }, [id]);

  // mode=edit 쿼리 파라미터가 있으면 편집 모드 활성화
  useEffect(() => {
    if (mode === 'edit' && state.ingredient) {
      dispatch({ type: 'SET_EDITING', payload: true });
    }
  }, [mode, state.ingredient]);

  // 재료가 로드되면 이모지 상태 초기화
  useEffect(() => {
    if (state.ingredient?.emoji && state.editForm.emoji) {
      // editForm의 emoji를 기반으로 템플릿 찾기
      const { getTemplatesByCategory } = require('@/constants/ingredientTemplates');
      const templates = getTemplatesByCategory(state.ingredient.category);
      const matchedTemplate = templates.find((t: IngredientTemplate) => t.emoji === state.editForm.emoji);
      if (matchedTemplate) {
        setSelectedEmoji(matchedTemplate);
      }
    }
  }, [state.ingredient, state.editForm.emoji]);

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

      case 'SHOW_CONFIRM':
        confirm({
          title: effect.payload.title,
          message: effect.payload.message,
          onConfirm: async () => {
            await effect.payload.onConfirm();
            // 삭제/소모 성공 후 처리
            if (effect.payload.title?.includes('삭제')) {
              dispatch({ type: 'DELETE_SUCCESS' });
            } else if (effect.payload.title?.includes('소모')) {
              dispatch({
                type: 'CONSUME_SUCCESS',
                payload: { name: state.ingredient?.name || '' },
              });
            }
          },
          onCancel: undefined,
          confirmText: effect.payload.isDanger ? '삭제' : '소모',
          cancelText: '취소',
          isDestructive: effect.payload.isDanger,
        });
        break;

      case 'NAVIGATE_BACK':
        router.back();
        break;
    }
  }, [effect]);

  // Android 시스템 백버튼 핸들링
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (state.isEditing) {
        // 수정 모드일 때는 수정 모드 취소
        dispatch({ type: 'SET_EDITING', payload: false });
        return true; // 기본 동작 방지
      }
      // 일반 모드일 때는 기본 동작 허용 (뒤로가기)
      return false;
    });

    return () => backHandler.remove();
  }, [state.isEditing, dispatch]);

  function handleFieldChange(field: keyof EditFormData, value: string) {
    dispatch({ type: 'UPDATE_FORM_FIELD', payload: { field, value } });
  }

  function handleDelete() {
    dispatch({ type: 'DELETE_INGREDIENT' });
  }

  function handleConsume() {
    dispatch({ type: 'CONSUME_INGREDIENT' });
  }

  function handleUpdate() {
    dispatch({ type: 'UPDATE_INGREDIENT' });
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
  }

  function handleEmojiConfirm() {
    setIsEmojiPickerVisible(false);
  }

  if (!state.ingredient) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[typography.styles.body, { color: colors.text }]}>로딩 중이에요...</Text>
      </View>
    );
  }

  return (
    <>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header
          title=""
          onBackPress={() => {
            if (state.isEditing) {
              dispatch({ type: 'SET_EDITING', payload: false });
            } else {
              dispatch({ type: 'NAVIGATE_BACK' });
            }
          }}
        />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <ScrollView
            style={styles.content}
            contentContainerStyle={{ paddingBottom: state.isEditing ? 200 : 24 }}
            showsVerticalScrollIndicator={false}
          >
            <View>
              {state.isEditing ? (
                <View style={styles.editSection}>
                  <View style={styles.inputGroup}>
                    <View style={styles.inputHeader}>
                      <Text style={[typography.styles.bodySemibold, { color: colors.text }]}>이름</Text>
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
                      ]}
                      value={state.editForm.name}
                      onChangeText={(text) => handleFieldChange('name', text)}
                      placeholder="식재료 이름"
                      placeholderTextColor={colors.textTertiary}
                    />
                  </View>

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
                            state.editForm.category === cat.id && {
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
                                state.editForm.category === cat.id && {
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
                        value={state.editForm.quantity}
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
                              color: state.editForm.unit ? colors.text : colors.textTertiary,
                            },
                          ]}
                        >
                          {state.editForm.unit
                            ? findUnitById(state.editForm.unit as any)?.krLabel || state.editForm.unit
                            : '선택'}
                        </Text>
                        <Ionicons name="chevron-down" size={20} color={colors.textTertiary} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <View style={[styles.row, { justifyContent: 'space-between', alignItems: 'center' }]}>
                      <Text style={[typography.styles.bodySemibold, { color: colors.text }]}>구매일</Text>

                      <TouchableOpacity
                        style={styles.checkboxRow}
                        onPress={() => {
                          if (state.editForm.purchase_date) {
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
                                state.editForm.purchase_date === new Date().toISOString().split('T')[0]
                                  ? colors.primary
                                  : colors.border,
                              backgroundColor:
                                state.editForm.purchase_date === new Date().toISOString().split('T')[0]
                                  ? colors.primary
                                  : 'transparent',
                            },
                          ]}
                        >
                          {state.editForm.purchase_date === new Date().toISOString().split('T')[0] && (
                            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                          )}
                        </View>
                        <Text style={[typography.styles.bodySmall, { color: colors.textTertiary }]}>등록일과 동일</Text>
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
                      onPress={() => purchaseDatePicker.open(state.editForm.purchase_date || new Date())}
                    >
                      <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
                      <Text
                        style={[
                          typography.styles.body,
                          {
                            color: state.editForm.purchase_date ? colors.text : colors.textTertiary,
                          },
                        ]}
                      >
                        {state.editForm.purchase_date || '날짜 선택'}
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
                          <Text style={[typography.styles.caption, { color: colors.textSecondary }]}>
                            {option.krLabel}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.dateButton,
                        {
                          backgroundColor: colors.surface,
                          borderColor: colors.border,
                        },
                      ]}
                      onPress={() => expiryDatePicker.open(state.editForm.expiry_date || new Date())}
                    >
                      <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
                      <Text
                        style={[
                          typography.styles.body,
                          {
                            color: state.editForm.expiry_date ? colors.text : colors.textTertiary,
                          },
                        ]}
                      >
                        {state.editForm.expiry_date || '날짜 선택'}
                      </Text>
                    </TouchableOpacity>
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
                            state.editForm.storage_location === loc.id && {
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
                              state.editForm.storage_location === loc.id && {
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
                      value={state.editForm.memo}
                      onChangeText={(text) => handleFieldChange('memo', text)}
                      placeholder="메모를 입력하세요"
                      placeholderTextColor={colors.textTertiary}
                      multiline
                      numberOfLines={4}
                    />
                  </View>
                </View>
              ) : (
                <View style={styles.detailSection}>
                  <View style={[styles.mainInfo, { borderBottomColor: colors.border }]}>
                    <Text style={[typography.styles.h3, { color: colors.text }]}>{state.ingredient.name}</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: getStatusColor(state.ingredient.status),
                        },
                      ]}
                    >
                      <Text style={[typography.styles.captionBold, { color: '#ffffff' }]}>
                        {findStatusById(state.ingredient.status)?.krLabel}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.infoGrid}>
                    <View style={styles.infoItem}>
                      <Text style={[typography.styles.bodySmall, { color: colors.textSecondary }]}>카테고리</Text>
                      <Text style={[typography.styles.bodySemibold, { color: colors.text }]}>
                        {findCategoryById(state.ingredient.category)?.krLabel}
                      </Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Text style={[typography.styles.bodySmall, { color: colors.textSecondary }]}>수량</Text>
                      <Text style={[typography.styles.bodySemibold, { color: colors.text }]}>
                        {state.ingredient.quantity || '-'}
                      </Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Text style={[typography.styles.bodySmall, { color: colors.textSecondary }]}>보관 위치</Text>
                      <Text style={[typography.styles.bodySemibold, { color: colors.text }]}>
                        {findStorageLocationById(state.ingredient.storage_location)?.krLabel}
                      </Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Text style={[typography.styles.bodySmall, { color: colors.textSecondary }]}>등록일</Text>
                      <Text style={[typography.styles.bodySemibold, { color: colors.text }]}>
                        {state.ingredient.registration_date || '-'}
                      </Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Text style={[typography.styles.bodySmall, { color: colors.textSecondary }]}>구매일</Text>
                      <Text style={[typography.styles.bodySemibold, { color: colors.text }]}>
                        {state.ingredient.purchase_date || '-'}
                      </Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Text style={[typography.styles.bodySmall, { color: colors.textSecondary }]}>유통기한</Text>
                      <Text style={[typography.styles.bodySemibold, { color: colors.text }]}>
                        {state.ingredient.expiry_date || '-'}
                      </Text>
                    </View>
                  </View>

                  {state.ingredient.memo && (
                    <View style={[styles.memoSection, { borderTopColor: colors.border }]}>
                      <Text style={[typography.styles.label, { color: colors.textSecondary }]}>메모</Text>
                      <Text style={[typography.styles.bodySmall, { color: colors.text }]}>{state.ingredient.memo}</Text>
                    </View>
                  )}
                </View>
              )}
            </View>

            {!state.isEditing && (
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.consumeButton, { backgroundColor: colors.primary }]}
                  onPress={handleConsume}
                >
                  <Minus size={20} color="#ffffff" />
                  <Text style={[typography.styles.button, { color: '#ffffff' }]}>소모</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.deleteButton, { backgroundColor: colors.danger }]}
                  onPress={handleDelete}
                >
                  <Trash2 size={20} color="#ffffff" />
                  <Text style={[typography.styles.button, { color: '#ffffff' }]}>삭제</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>

        {state.isEditing ? (
          <FloatingButton
            onPress={handleUpdate}
            icon={<Check size={24} color="#FFFFFF" />}
            label="저장하기"
            backgroundColor={colors.success}
            hasTabBar={false}
          />
        ) : (
          <FloatingButton
            onPress={() => dispatch({ type: 'SET_EDITING', payload: true })}
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

      <AddEmojiBottomSheet
        visible={isEmojiPickerVisible}
        onClose={() => setIsEmojiPickerVisible(false)}
        selectedCategoryId={state.editForm.category}
        selectedTemplates={selectedEmoji ? [selectedEmoji] : []}
        onTemplateToggle={handleEmojiSelect}
        onConfirm={handleEmojiConfirm}
      />
    </>
  );
}

const createStyles = ({
  colors,
  spacing,
  borderRadius,
}: {
  colors: ColorPalette;
  spacing: typeof import('@/lib/theme').spacing;
  borderRadius: typeof import('@/lib/theme').borderRadius;
}) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      padding: spacing.xl,
    },
    detailSection: {
      gap: spacing.xl,
    },
    mainInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: spacing.xl,
      borderBottomWidth: 1,
    },
    statusBadge: {
      paddingHorizontal: spacing.md,
      paddingVertical: 6,
      borderRadius: borderRadius.md,
    },
    infoGrid: {
      gap: spacing.lg,
    },
    infoItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    memoSection: {
      gap: spacing.sm,
      paddingTop: spacing.xl,
      borderTopWidth: 1,
    },
    editSection: {
      gap: spacing.xl,
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
    actionButtons: {
      flexDirection: 'row',
      gap: spacing.md,
      marginTop: spacing.xxl,
    },
    consumeButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.lg,
      borderRadius: borderRadius.xl,
      gap: spacing.sm,
    },
    deleteButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.lg,
      borderRadius: borderRadius.xl,
      gap: spacing.sm,
    },
    dateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingHorizontal: spacing.lg,
      paddingVertical: 14,
      borderRadius: borderRadius.xl,
      borderWidth: 1,
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
