import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { ArrowLeft, ChefHat, Clock, Check } from 'lucide-react-native';
import { storage } from '@/lib/storage';
import { recipes, Recipe } from '@/lib/recipes';
import { useTheme } from '@/lib/theme';
import { useDialog } from '@/hooks/useDialog';

export default function CookingScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { alert, confirm, DialogComponent } = useDialog();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [availableRecipes, setAvailableRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    fetchIngredients();
  }, []);

  async function fetchIngredients() {
    const data = await storage.getIngredients();
    setIngredients(data);
    checkAvailableRecipes(data);
  }

  function checkAvailableRecipes(userIngredients: any[]) {
    const available = recipes.filter(recipe => {
      return recipe.ingredients.every(recipeIng => {
        const userIng = userIngredients.find(
          ui => ui.name.toLowerCase().includes(recipeIng.name.toLowerCase()) ||
                recipeIng.name.toLowerCase().includes(ui.name.toLowerCase())
        );
        return userIng && userIng.quantity >= recipeIng.quantity;
      });
    });
    setAvailableRecipes(available);
  }

  function canMakeRecipe(recipe: Recipe): boolean {
    return availableRecipes.some(r => r.id === recipe.id);
  }

  async function handleCook(recipe: Recipe) {
    if (!canMakeRecipe(recipe)) {
      alert('알림', '재료가 부족해요. 추가해볼까요?', 'warning');
      return;
    }

    confirm(
      '요리하기',
      `${recipe.name}을(를) 만들까요? 재료가 자동으로 차감돼요.`,
      async () => {
        try {
          for (const recipeIng of recipe.ingredients) {
            const userIng = ingredients.find(
              ui => ui.name.toLowerCase().includes(recipeIng.name.toLowerCase()) ||
                    recipeIng.name.toLowerCase().includes(ui.name.toLowerCase())
            );

            if (userIng) {
              const newQuantity = userIng.quantity - recipeIng.quantity;
              if (newQuantity <= 0) {
                await storage.deleteIngredient(userIng.id);
              } else {
                await storage.updateIngredient(userIng.id, {
                  quantity: newQuantity,
                });
              }
            }
          }

          alert('완료', `${recipe.name} 완성했어요!`, 'success');
          router.back();
        } catch (error) {
          console.error('Error cooking:', error);
          alert('알림', '문제가 발생했어요. 다시 시도해주세요.', 'error');
        }
      },
      undefined,
      '요리하기',
      '취소'
    );
  }

  if (selectedRecipe) {
    const canMake = canMakeRecipe(selectedRecipe);

    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.surface }]}>
          <TouchableOpacity onPress={() => setSelectedRecipe(null)} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>레시피 보기</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={[styles.recipeDetailCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.recipeDetailName, { color: colors.text }]}>{selectedRecipe.name}</Text>
            <View style={styles.recipeDetailMeta}>
              <View style={[styles.metaItem, { backgroundColor: colors.background }]}>
                <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>카테고리</Text>
                <Text style={[styles.metaValue, { color: colors.text }]}>{selectedRecipe.category}</Text>
              </View>
              <View style={[styles.metaItem, { backgroundColor: colors.background }]}>
                <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>난이도</Text>
                <Text style={[styles.metaValue, { color: colors.text }]}>{selectedRecipe.difficulty}</Text>
              </View>
              <View style={[styles.metaItem, { backgroundColor: colors.background }]}>
                <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>조리시간</Text>
                <Text style={[styles.metaValue, { color: colors.text }]}>{selectedRecipe.cookingTime}분</Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <Text style={[styles.ingredientsTitle, { color: colors.text }]}>필요한 재료는 이거에요</Text>
            <View style={styles.ingredientsList}>
              {selectedRecipe.ingredients.map((ing, index) => {
                const userIng = ingredients.find(
                  ui => ui.name.toLowerCase().includes(ing.name.toLowerCase()) ||
                        ing.name.toLowerCase().includes(ui.name.toLowerCase())
                );
                const hasEnough = userIng && userIng.quantity >= ing.quantity;

                return (
                  <View key={index} style={styles.ingredientRow}>
                    <View style={styles.ingredientRowLeft}>
                      {hasEnough ? (
                        <Check size={18} color={colors.primary} />
                      ) : (
                        <View style={[styles.missingDot, { borderColor: colors.danger }]} />
                      )}
                      <Text style={[
                        styles.ingredientRowName,
                        { color: colors.text },
                        !hasEnough && { color: colors.danger }
                      ]}>
                        {ing.name}
                      </Text>
                    </View>
                    <Text style={[
                      styles.ingredientRowQuantity,
                      { color: colors.textSecondary },
                      !hasEnough && { color: colors.danger }
                    ]}>
                      {ing.quantity}{ing.unit}
                      {userIng && ` (보유: ${userIng.quantity}${userIng.unit})`}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.cookButton, { backgroundColor: colors.primary }, !canMake && { backgroundColor: colors.textTertiary }]}
            onPress={() => handleCook(selectedRecipe)}
            disabled={!canMake}>
            <ChefHat size={20} color="#FFFFFF" />
            <Text style={styles.cookButtonText}>
              {canMake ? '만들어볼게요' : '재료가 부족해요'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>요리해볼까요?</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {availableRecipes.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>지금 바로 만들 수 있어요</Text>
            {availableRecipes.map(recipe => (
              <TouchableOpacity
                key={recipe.id}
                style={[styles.recipeCard, { backgroundColor: colors.surface }]}
                onPress={() => setSelectedRecipe(recipe)}
                activeOpacity={0.7}>
                <View style={[styles.recipeIcon, { backgroundColor: colors.primaryLight }]}>
                  <ChefHat size={24} color={colors.primary} />
                </View>
                <View style={styles.recipeInfo}>
                  <Text style={[styles.recipeName, { color: colors.text }]}>{recipe.name}</Text>
                  <View style={styles.recipeMetaRow}>
                    <Text style={[styles.recipeMeta, { color: colors.textSecondary }]}>{recipe.category}</Text>
                    <View style={[styles.recipeDot, { backgroundColor: colors.textTertiary }]} />
                    <Clock size={12} color={colors.textSecondary} />
                    <Text style={[styles.recipeMeta, { color: colors.textSecondary }]}>{recipe.cookingTime}분</Text>
                  </View>
                </View>
                <View style={[styles.canMakeBadge, { backgroundColor: colors.primaryLight }]}>
                  <Check size={16} color={colors.primary} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>다른 레시피도 보세요</Text>
          {recipes.filter(r => !availableRecipes.some(ar => ar.id === r.id)).map(recipe => (
            <TouchableOpacity
              key={recipe.id}
              style={[styles.recipeCard, { backgroundColor: colors.surface }, styles.unavailableCard]}
              onPress={() => setSelectedRecipe(recipe)}
              activeOpacity={0.7}>
              <View style={[styles.recipeIcon, { backgroundColor: colors.surfaceSecondary }]}>
                <ChefHat size={24} color={colors.textTertiary} />
              </View>
              <View style={styles.recipeInfo}>
                <Text style={[styles.recipeName, { color: colors.textTertiary }]}>{recipe.name}</Text>
                <View style={styles.recipeMetaRow}>
                  <Text style={[styles.recipeMeta, { color: colors.textTertiary }]}>{recipe.category}</Text>
                  <View style={[styles.recipeDot, { backgroundColor: colors.textTertiary }]} />
                  <Clock size={12} color={colors.textTertiary} />
                  <Text style={[styles.recipeMeta, { color: colors.textTertiary }]}>{recipe.cookingTime}분</Text>
                </View>
              </View>
              <Text style={[styles.unavailableBadge, { color: colors.textTertiary }]}>재료 부족</Text>
            </TouchableOpacity>
          ))}
        </View>
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
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  recipeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  unavailableCard: {
    opacity: 0.6,
  },
  recipeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeInfo: {
    flex: 1,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  recipeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recipeMeta: {
    fontSize: 13,
  },
  recipeDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  canMakeBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unavailableText: {},
  unavailableBadge: {
    fontSize: 12,
    fontWeight: '600',
  },
  recipeDetailCard: {
    margin: 20,
    borderRadius: 16,
    padding: 20,
  },
  recipeDetailName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  recipeDetailMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  metaLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 20,
  },
  ingredientsTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  ingredientsList: {
    gap: 12,
  },
  ingredientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ingredientRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ingredientRowName: {
    fontSize: 15,
  },
  ingredientRowQuantity: {
    fontSize: 14,
  },
  missingDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
  },
  missingIngredient: {},
  cookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  cookButtonDisabled: {},
  cookButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
