import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useEffect, useMemo } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Trash2, Edit3, Minus } from 'lucide-react-native';
import { useTheme, getStatusColor } from '@/lib/theme';
import { useDialog } from '@/hooks/useDialog';
import { useRouter } from '@/hooks/useRouter';
import { useMVIStore } from '@/mvi/base';
import {
  createIngredientDetailStore,
  EditFormData,
} from '@/mvi/features/ingredient-detail';
import { getCategoryIcon } from '@/utils/categoryIcons';
import Header from '@/components/Header';

export default function IngredientDetailScreen() {
  const router = useRouter();
  const { colors, typography, spacing, borderRadius, shadows } = useTheme();
  const { id } = useLocalSearchParams();
  const { alert, confirm, DialogComponent } = useDialog();
  const [state, dispatch, effect] = useMVIStore(createIngredientDetailStore);

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

  // Effect 처리
  useEffect(() => {
    if (!effect) return;

    switch (effect.type) {
      case 'SHOW_ALERT':
        alert(
          effect.payload.title,
          effect.payload.message,
          effect.payload.variant,
        );
        break;

      case 'SHOW_CONFIRM':
        confirm(
          effect.payload.title,
          effect.payload.message,
          async () => {
            await effect.payload.onConfirm();
            // 삭제/소모 후 화면 이동
            if (
              effect.payload.title.includes('삭제') ||
              effect.payload.title.includes('소모')
            ) {
              if (effect.payload.title.includes('소모')) {
                alert(
                  '완료',
                  `${state.ingredient?.name}이(가) 장보기 목록에 추가되었습니다.`,
                  'success',
                );
              }
              router.back();
            }
          },
          undefined,
          effect.payload.isDanger ? '삭제' : '소모',
          '취소',
          effect.payload.isDanger,
        );
        break;

      case 'NAVIGATE_BACK':
        router.back();
        break;
    }
  }, [effect]);

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

  function toggleEditing() {
    if (state.isEditing) {
      handleUpdate();
    } else {
      dispatch({ type: 'SET_EDITING', payload: true });
    }
  }

  if (!state.ingredient) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[typography.styles.body, { color: colors.text }]}>
          로딩 중...
        </Text>
      </View>
    );
  }

  return (
    <>
      <DialogComponent />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header
          title="식재료 상세"
          onBackPress={() => dispatch({ type: 'NAVIGATE_BACK' })}
          rightComponent={
            <TouchableOpacity onPress={toggleEditing}>
              <Edit3 size={24} color={colors.primary} />
            </TouchableOpacity>
          }
        />

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
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
                    style={[styles.inputGroup, { flex: 1, marginLeft: spacing.md }]}
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
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: colors.surface,
                        color: colors.text,
                        borderColor: colors.border,
                      },
                    ]}
                    value={state.editForm.expiry_date}
                    onChangeText={(text) =>
                      handleFieldChange('expiry_date', text)
                    }
                    placeholder="YYYY-MM-DD"
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
                  <Text style={[typography.styles.h3, { color: colors.text }]}>
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
                      {state.ingredient.quantity} {state.ingredient.unit}
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
                  { backgroundColor: colors.success },
                ]}
                onPress={handleConsume}
              >
                <Minus size={20} color="#ffffff" />
                <Text style={[typography.styles.button, { color: '#ffffff' }]}>
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
                <Text style={[typography.styles.button, { color: '#ffffff' }]}>
                  삭제
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
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
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 60,
      paddingHorizontal: spacing.xl,
      paddingBottom: spacing.lg,
    },
    backButton: {
      padding: spacing.xs,
    },
    editButton: {
      padding: spacing.xs,
    },
    content: {
      flex: 1,
    },
    card: {
      margin: spacing.xl,
      borderRadius: borderRadius.lg,
      padding: spacing.xl,
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
      paddingHorizontal: spacing.xl,
      paddingBottom: spacing.xl,
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
  });
