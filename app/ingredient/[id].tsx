import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Trash2, Edit3, Minus, Calendar } from 'lucide-react-native';
import { storage, Ingredient as StoredIngredient } from '@/lib/storage';
import { useTheme, getStatusColor } from '@/lib/theme';
import { useDialog } from '@/hooks/useDialog';

interface Ingredient extends StoredIngredient {
  status: string;
}

export default function IngredientDetailScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { id } = useLocalSearchParams();
  const { alert, confirm, DialogComponent } = useDialog();
  const [ingredient, setIngredient] = useState<Ingredient | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    category: '',
    quantity: '',
    unit: '',
    expiry_date: '',
    storage_location: '',
    memo: '',
  });

  useEffect(() => {
    fetchIngredient();
  }, [id]);

  async function fetchIngredient() {
    try {
      const ingredients = await storage.getIngredients();
      const data = ingredients.find(item => item.id === id);

      if (data) {
        const status = calculateStatus(data.expiry_date);
        setIngredient({ ...data, status });
        setEditForm({
          name: data.name,
          category: data.category,
          quantity: data.quantity.toString(),
          unit: data.unit,
          expiry_date: data.expiry_date || '',
          storage_location: data.storage_location,
          memo: data.memo || '',
        });
      }
    } catch (error) {
      console.error('Error fetching ingredient:', error);
    }
  }

  function calculateStatus(expiryDate: string | null): string {
    if (!expiryDate) return '신선';

    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return '소모됨';
    if (diffDays <= 3) return '주의';
    return '신선';
  }

  async function handleDelete() {
    confirm(
      '삭제 확인',
      '이 식재료를 삭제하시겠습니까?',
      async () => {
        try {
          await storage.deleteIngredient(id as string);
          router.back();
        } catch (error) {
          console.error('Error deleting ingredient:', error);
        }
      },
      undefined,
      '삭제',
      '취소',
      true
    );
  }

  async function handleConsume() {
    if (!ingredient) return;

    confirm(
      '소모 확인',
      `${ingredient.name}을(를) 소모 처리하시겠습니까?\n장보기 목록에 자동으로 추가됩니다.`,
      async () => {
        try {
          await storage.addToShoppingList({
            name: ingredient.name,
            category: ingredient.category,
            unit: ingredient.unit,
          });
          await storage.deleteIngredient(id as string);
          alert('완료', `${ingredient.name}이(가) 장보기 목록에 추가되었습니다.`, 'success');
          router.back();
        } catch (error) {
          console.error('Error consuming ingredient:', error);
        }
      },
      undefined,
      '소모',
      '취소'
    );
  }

  async function handleUpdate() {
    try {
      await storage.updateIngredient(id as string, {
        name: editForm.name,
        category: editForm.category,
        quantity: parseInt(editForm.quantity) || 0,
        unit: editForm.unit,
        expiry_date: editForm.expiry_date || null,
        storage_location: editForm.storage_location,
        memo: editForm.memo,
      });

      setIsEditing(false);
      fetchIngredient();
    } catch (error) {
      console.error('Error updating ingredient:', error);
    }
  }


  if (!ingredient) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>로딩 중...</Text>
      </View>
    );
  }

  return (
    <>
      <DialogComponent />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.surface }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>식재료 상세</Text>
        <TouchableOpacity
          onPress={() => (isEditing ? handleUpdate() : setIsEditing(true))}
          style={styles.editButton}>
          <Edit3 size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          {isEditing ? (
            <View style={styles.editSection}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>이름</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surfaceSecondary, color: colors.text }]}
                  value={editForm.name}
                  onChangeText={(text) => setEditForm({ ...editForm, name: text })}
                  placeholder="식재료 이름"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>카테고리</Text>
                <View style={styles.categoryButtons}>
                  {['채소', '과일', '육류', '유제품', '기타'].map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryBtn,
                        { backgroundColor: colors.surfaceSecondary },
                        editForm.category === cat && { backgroundColor: colors.primary },
                      ]}
                      onPress={() => setEditForm({ ...editForm, category: cat })}>
                      <Text
                        style={[
                          styles.categoryBtnText,
                          { color: colors.textSecondary },
                          editForm.category === cat && { color: '#ffffff' },
                        ]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>수량</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.surfaceSecondary, color: colors.text }]}
                    value={editForm.quantity}
                    onChangeText={(text) => setEditForm({ ...editForm, quantity: text })}
                    keyboardType="numeric"
                    placeholder="0"
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>단위</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.surfaceSecondary, color: colors.text }]}
                    value={editForm.unit}
                    onChangeText={(text) => setEditForm({ ...editForm, unit: text })}
                    placeholder="개, g, ml"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>유통기한</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surfaceSecondary, color: colors.text }]}
                  value={editForm.expiry_date}
                  onChangeText={(text) => setEditForm({ ...editForm, expiry_date: text })}
                  placeholder="YYYY-MM-DD"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>보관 위치</Text>
                <View style={styles.categoryButtons}>
                  {['냉장실', '냉동실', '실온'].map((loc) => (
                    <TouchableOpacity
                      key={loc}
                      style={[
                        styles.categoryBtn,
                        { backgroundColor: colors.surfaceSecondary },
                        editForm.storage_location === loc && { backgroundColor: colors.primary },
                      ]}
                      onPress={() => setEditForm({ ...editForm, storage_location: loc })}>
                      <Text
                        style={[
                          styles.categoryBtnText,
                          { color: colors.textSecondary },
                          editForm.storage_location === loc && { color: '#ffffff' },
                        ]}>
                        {loc}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>메모</Text>
                <TextInput
                  style={[styles.input, styles.textArea, { backgroundColor: colors.surfaceSecondary, color: colors.text }]}
                  value={editForm.memo}
                  onChangeText={(text) => setEditForm({ ...editForm, memo: text })}
                  placeholder="메모를 입력하세요"
                  multiline
                  numberOfLines={4}
                />
              </View>
            </View>
          ) : (
            <View style={styles.detailSection}>
              <View style={[styles.mainInfo, { borderBottomColor: colors.border }]}>
                <Text style={[styles.ingredientName, { color: colors.text }]}>{ingredient.name}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ingredient.status) }]}>
                  <Text style={[styles.statusText, { color: '#ffffff' }]}>{ingredient.status}</Text>
                </View>
              </View>

              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>카테고리</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>{ingredient.category}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>수량</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    {ingredient.quantity} {ingredient.unit}
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>보관 위치</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>{ingredient.storage_location}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>구매일</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>{ingredient.purchase_date || '-'}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>유통기한</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>{ingredient.expiry_date || '-'}</Text>
                </View>
              </View>

              {ingredient.memo && (
                <View style={[styles.memoSection, { borderTopColor: colors.border }]}>
                  <Text style={[styles.memoLabel, { color: colors.textSecondary }]}>메모</Text>
                  <Text style={[styles.memoText, { color: colors.text }]}>{ingredient.memo}</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {!isEditing && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={[styles.consumeButton, { backgroundColor: colors.success }]} onPress={handleConsume}>
              <Minus size={20} color="#ffffff" />
              <Text style={[styles.buttonText, { color: '#ffffff' }]}>소모</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.deleteButton, { backgroundColor: colors.danger }]} onPress={handleDelete}>
              <Trash2 size={20} color="#ffffff" />
              <Text style={[styles.buttonText, { color: '#ffffff' }]}>삭제</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  editButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  card: {
    margin: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  detailSection: {
    gap: 20,
  },
  mainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  ingredientName: {
    fontSize: 24,
    fontWeight: '700',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  memoSection: {
    gap: 8,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  memoLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  memoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  editSection: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
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
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  consumeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
