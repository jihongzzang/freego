import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Camera, Edit, Carrot, Apple, Beef, Milk, Package } from 'lucide-react-native';
import { storage } from '@/lib/storage';
import { useTheme } from '@/lib/theme';
import { useDialog } from '@/hooks/useDialog';

export default function AddIngredientScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { alert, DialogComponent } = useDialog();
  const [mode, setMode] = useState<'select' | 'manual'>('select');

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
  const [form, setForm] = useState({
    name: '',
    category: '채소',
    quantity: '1',
    unit: '개',
    expiry_date: '',
    storage_location: '냉장실',
    memo: '',
  });

  async function handleSubmit() {
    if (!form.name.trim()) {
      alert('알림', '재료 이름을 입력해주세요.', 'warning');
      return;
    }

    if (!form.quantity.trim() || parseInt(form.quantity) <= 0) {
      alert('알림', '수량을 입력해주세요.', 'warning');
      return;
    }

    try {
      await storage.addIngredient({
        name: form.name,
        category: form.category,
        quantity: parseInt(form.quantity),
        unit: form.unit,
        purchase_date: new Date().toISOString().split('T')[0],
        expiry_date: form.expiry_date || null,
        storage_location: form.storage_location,
        memo: form.memo,
      });

      alert('성공', '식재료가 등록되었습니다.', 'success');
      setForm({
        name: '',
        category: '채소',
        quantity: '1',
        unit: '개',
        expiry_date: '',
        storage_location: '냉장실',
        memo: '',
      });
      setMode('select');
      router.push('/(tabs)');
    } catch (error) {
      console.error('Error adding ingredient:', error);
      alert('오류', '식재료 등록에 실패했습니다.', 'error');
    }
  }

  if (mode === 'select') {
    setMode('manual');
  }

  return (
    <>
      <DialogComponent />
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}>
        <View style={[styles.header, { backgroundColor: colors.surface }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>재료 추가</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>관리하고 싶은 재료만 추가해보세요</Text>
      </View>

      <ScrollView
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              이름 <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
              placeholder="기억하고 싶은 재료 이름"
              placeholderTextColor={colors.textTertiary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>카테고리</Text>
            <View style={styles.categoryButtons}>
              {['채소', '과일', '육류', '유제품', '기타'].map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryBtn,
                    { backgroundColor: colors.surfaceSecondary, borderColor: colors.surfaceSecondary },
                    form.category === cat && { backgroundColor: colors.primaryLight, borderColor: colors.primary },
                  ]}
                  onPress={() => setForm({ ...form, category: cat })}>
                  <View style={styles.categoryBtnContent}>
                    {getCategoryIcon(cat)}
                    <Text
                      style={[
                        styles.categoryBtnText,
                        { color: colors.textSecondary },
                        form.category === cat && { color: colors.primary },
                      ]}>
                      {cat}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={[styles.label, { color: colors.text }]}>
                수량 <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                value={form.quantity}
                onChangeText={(text) => setForm({ ...form, quantity: text })}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={colors.textTertiary}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
              <Text style={[styles.label, { color: colors.text }]}>단위</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                value={form.unit}
                onChangeText={(text) => setForm({ ...form, unit: text })}
                placeholder="개, g, ml"
                placeholderTextColor={colors.textTertiary}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>유통기한</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
              value={form.expiry_date}
              onChangeText={(text) => setForm({ ...form, expiry_date: text })}
              placeholder="YYYY-MM-DD (예: 2025-12-31)"
              placeholderTextColor={colors.textTertiary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>보관 위치</Text>
            <View style={styles.categoryButtons}>
              {['냉장실', '냉동실', '실온'].map((loc) => (
                <TouchableOpacity
                  key={loc}
                  style={[
                    styles.categoryBtn,
                    { backgroundColor: colors.surfaceSecondary, borderColor: colors.surfaceSecondary },
                    form.storage_location === loc && { backgroundColor: colors.primaryLight, borderColor: colors.primary },
                  ]}
                  onPress={() => setForm({ ...form, storage_location: loc })}>
                  <Text
                    style={[
                      styles.categoryBtnText,
                      { color: colors.textSecondary },
                      form.storage_location === loc && { color: colors.primary },
                    ]}>
                    {loc}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>메모</Text>
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
              value={form.memo}
              onChangeText={(text) => setForm({ ...form, memo: text })}
              placeholder="특별히 기억하고 싶은 내용이 있나요?"
              placeholderTextColor={colors.textTertiary}
              multiline
              numberOfLines={4}
            />
          </View>

          <TouchableOpacity style={[styles.submitButton, { backgroundColor: colors.primary }]} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>추가할게요</Text>
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
