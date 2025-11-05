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
import { useTheme, getStatusColor } from '@/lib/theme';
import { useDialog } from '@/contexts/DialogContext';
import { useRouter } from '@/hooks/useRouter';
import { useMVIStore } from '@/mvi/base';
import {
  createIngredientDetailStore,
  EditFormData,
} from '@/mvi/features/ingredient-detail';
import { getCategoryIcon } from '@/utils/categoryIcons';
import Header from '@/components/Header';
import FloatingButton from '@/components/FloatingButton';
import BottomSheet from '@/components/BottomSheet';
import DatePicker from '@/components/DatePicker';

export default function IngredientDetailScreen() {
  const router = useRouter();
  const { colors, typography, spacing, borderRadius, shadows } = useTheme();
  const { id, mode } = useLocalSearchParams();
  const { alert, confirm } = useDialog();
  const [state, dispatch, effect] = useMVIStore(createIngredientDetailStore);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const styles = useMemo(
    () => createStyles({ spacing, borderRadius, shadows }),
    [spacing, borderRadius],
  );

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
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (state.isEditing) {
          // 수정 모드일 때는 수정 모드 취소
          dispatch({ type: 'SET_EDITING', payload: false });
          return true; // 기본 동작 방지
        }
        // 일반 모드일 때는 기본 동작 허용 (뒤로가기)
        return false;
      },
    );

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

  if (!state.ingredient) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[typography.styles.body, { color: colors.text }]}>
          로딩 중이에요...
        </Text>
      </View>
    );
  }

  return (
    <>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header
          title="재료 정보"
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
            showsVerticalScrollIndicator={false}
          >
            <View
              style={[
                state.isEditing ? styles.editCard : styles.card,
                { backgroundColor: colors.surface },
              ]}
            >
              {state.isEditing ? (
                <View style={styles.editSection}>
                  <View style={styles.inputGroup}>
                    <Text
                      style={[
                        typography.styles.bodySemibold,
                        { color: colors.text },
                      ]}
                    >
                      이름
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
                      value={state.editForm.name}
                      onChangeText={(text) => handleFieldChange('name', text)}
                      placeholder="식재료 이름"
                      placeholderTextColor={colors.textTertiary}
                    />
                  </View>

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
                        '기타',
                      ].map((cat) => (
                        <TouchableOpacity
                          key={cat}
                          style={[
                            styles.categoryBtn,
                            {
                              backgroundColor: colors.surfaceSecondary,
                              borderColor: colors.surfaceSecondary,
                            },
                            state.editForm.category === cat && {
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
                                state.editForm.category === cat && {
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
                        value={state.editForm.quantity}
                        onChangeText={(text) =>
                          handleFieldChange('quantity', text)
                        }
                        keyboardType="numeric"
                        placeholder="0"
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
                        value={state.editForm.unit}
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

                    <TouchableOpacity
                      style={[
                        styles.dateButton,
                        {
                          backgroundColor: colors.surface,
                          borderColor: colors.border,
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
                            color: state.editForm.expiry_date
                              ? colors.text
                              : colors.textTertiary,
                          },
                        ]}
                      >
                        {state.editForm.expiry_date || '날짜 선택'}
                      </Text>
                    </TouchableOpacity>
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
                            state.editForm.storage_location === loc && {
                              backgroundColor: colors.primaryLight,
                              borderColor: colors.primary,
                            },
                          ]}
                          onPress={() =>
                            handleFieldChange('storage_location', loc)
                          }
                        >
                          <Text
                            style={[
                              typography.styles.bodySemibold,
                              { color: colors.textSecondary },
                              state.editForm.storage_location === loc && {
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
                  <View
                    style={[
                      styles.mainInfo,
                      { borderBottomColor: colors.border },
                    ]}
                  >
                    <Text
                      style={[typography.styles.h3, { color: colors.text }]}
                    >
                      {state.ingredient.name}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: getStatusColor(
                            state.ingredient.status,
                          ),
                        },
                      ]}
                    >
                      <Text
                        style={[
                          typography.styles.captionBold,
                          { color: '#ffffff' },
                        ]}
                      >
                        {state.ingredient.status}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.infoGrid}>
                    <View style={styles.infoItem}>
                      <Text
                        style={[
                          typography.styles.bodySmall,
                          { color: colors.textSecondary },
                        ]}
                      >
                        카테고리
                      </Text>
                      <Text
                        style={[
                          typography.styles.bodySemibold,
                          { color: colors.text },
                        ]}
                      >
                        {state.ingredient.category}
                      </Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Text
                        style={[
                          typography.styles.bodySmall,
                          { color: colors.textSecondary },
                        ]}
                      >
                        수량
                      </Text>
                      <Text
                        style={[
                          typography.styles.bodySemibold,
                          { color: colors.text },
                        ]}
                      >
                        {state.ingredient.quantity || '-'}
                      </Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Text
                        style={[
                          typography.styles.bodySmall,
                          { color: colors.textSecondary },
                        ]}
                      >
                        보관 위치
                      </Text>
                      <Text
                        style={[
                          typography.styles.bodySemibold,
                          { color: colors.text },
                        ]}
                      >
                        {state.ingredient.storage_location}
                      </Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Text
                        style={[
                          typography.styles.bodySmall,
                          { color: colors.textSecondary },
                        ]}
                      >
                        구매일
                      </Text>
                      <Text
                        style={[
                          typography.styles.bodySemibold,
                          { color: colors.text },
                        ]}
                      >
                        {state.ingredient.purchase_date || '-'}
                      </Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Text
                        style={[
                          typography.styles.bodySmall,
                          { color: colors.textSecondary },
                        ]}
                      >
                        유통기한
                      </Text>
                      <Text
                        style={[
                          typography.styles.bodySemibold,
                          { color: colors.text },
                        ]}
                      >
                        {state.ingredient.expiry_date || '-'}
                      </Text>
                    </View>
                  </View>

                  {state.ingredient.memo && (
                    <View
                      style={[
                        styles.memoSection,
                        { borderTopColor: colors.border },
                      ]}
                    >
                      <Text
                        style={[
                          typography.styles.label,
                          { color: colors.textSecondary },
                        ]}
                      >
                        메모
                      </Text>
                      <Text
                        style={[
                          typography.styles.bodySmall,
                          { color: colors.text },
                        ]}
                      >
                        {state.ingredient.memo}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>

            {!state.isEditing && (
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[
                    styles.consumeButton,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={handleConsume}
                >
                  <Minus size={20} color="#ffffff" />
                  <Text
                    style={[typography.styles.button, { color: '#ffffff' }]}
                  >
                    소모
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.deleteButton,
                    { backgroundColor: colors.danger },
                  ]}
                  onPress={handleDelete}
                >
                  <Trash2 size={20} color="#ffffff" />
                  <Text
                    style={[typography.styles.button, { color: '#ffffff' }]}
                  >
                    삭제
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>

        {/* 플로팅 버튼 */}
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
    </>
  );
}

const createStyles = ({
  spacing,
  borderRadius,
  shadows,
}: {
  spacing: typeof import('@/lib/theme').spacing;
  borderRadius: typeof import('@/lib/theme').borderRadius;
  shadows: typeof import('@/lib/theme').shadows;
}) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      padding: spacing.xl,
    },
    card: {
      marginBottom: spacing.xl,
      borderRadius: borderRadius.lg,
      padding: spacing.xl,
      ...shadows.md,
    },
    editCard: {
      borderRadius: borderRadius.lg,
      padding: spacing.xl,
      marginBottom: 84,
      ...shadows.md,
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
    actionButtons: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    consumeButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.lg,
      borderRadius: borderRadius.md,
      gap: spacing.sm,
    },
    deleteButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.lg,
      borderRadius: borderRadius.md,
      gap: spacing.sm,
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
  });
