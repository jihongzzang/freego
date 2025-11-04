import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Carrot, Apple, Beef, Milk, Package } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import { useDialog } from '@/hooks/useDialog';
import { useMVIStore } from '@/mvi/base';
import { createAddStore } from '@/mvi/features/add';
import type { AddFormData } from '@/mvi/features/add';

export default function AddIngredientScreen() {
  return (
    <View style={{ flex: 1 }}>
      <AddIngredientContent />
    </View>
  );
}

function AddIngredientContent() {
  const router = useRouter();
  const { colors } = useTheme();
  const { alert, DialogComponent } = useDialog();
  const [state, dispatch, effect] = useMVIStore(createAddStore);

  function getCategoryIcon(category: string) {
    const size = 18;
    switch (category) {
      case '채소':
        return <Carrot size={size} color="#10b981" />;
      case '과일':
        return <Apple size={size} color="#ef4444" />;
      case '육류':
        return <Beef size={size} color="#f97316" />;
      case '유제품':
        return <Milk size={size} color="#3b82f6" />;
      default:
        return <Package size={size} color="#8b5cf6" />;
    }
  }

  // Effect 처리
  useEffect(() => {
    if (!effect) return;

    switch (effect.type) {
      case 'SHOW_ALERT':
        alert(
          effect.payload.title,
          effect.payload.message,
          effect.payload.variant
        );
        break;

      case 'NAVIGATE_HOME':
        router.push('/(tabs)');
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

  return (
    <>
      <DialogComponent />
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View style={[styles.header, { backgroundColor: colors.surface }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            재료 추가
          </Text>
          <Text
            style={[styles.headerSubtitle, { color: colors.textSecondary }]}
          >
            관리하고 싶은 재료만 추가해보세요
          </Text>
        </View>

        <ScrollView
          style={styles.formContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                이름 <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                  state.errors.name && { borderColor: '#F04452' },
                ]}
                value={state.form.name}
                onChangeText={(text) => handleFieldChange('name', text)}
                placeholder="기억하고 싶은 재료 이름"
                placeholderTextColor={colors.textTertiary}
              />
              {state.errors.name && (
                <Text style={[styles.errorText, { color: '#F04452' }]}>
                  {state.errors.name}
                </Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                카테고리
              </Text>
              <View style={styles.categoryButtons}>
                {['채소', '과일', '육류', '유제품', '기타'].map((cat) => (
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
                      {getCategoryIcon(cat)}
                      <Text
                        style={[
                          styles.categoryBtnText,
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
              </View>
            </View>


            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
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
                  state.errors.expiry_date && { borderColor: '#F04452' },
                ]}
                value={state.form.expiry_date}
                onChangeText={(text) => handleFieldChange('expiry_date', text)}
                placeholder="YYYY-MM-DD (예: 2025-12-31)"
                placeholderTextColor={colors.textTertiary}
              />
              {state.errors.expiry_date && (
                <Text style={[styles.errorText, { color: '#F04452' }]}>
                  {state.errors.expiry_date}
                </Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
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
                        styles.categoryBtnText,
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
              <Text style={[styles.label, { color: colors.text }]}>메모</Text>
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

            <TouchableOpacity
              style={[
                styles.submitButton,
                { backgroundColor: colors.primary },
                state.isSubmitting && { opacity: 0.6 },
              ]}
              onPress={handleSubmit}
              disabled={state.isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {state.isSubmitting ? '추가 중...' : '추가할게요'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  formContainer: {
    flex: 1,
  },
  form: {
    padding: 20,
    gap: 24,
    paddingBottom: 40,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  required: {
    color: '#F04452',
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 12,
    marginTop: -4,
  },
  row: {
    flexDirection: 'row',
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryBtnActive: {},
  categoryBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoryBtnTextActive: {},
  submitButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
