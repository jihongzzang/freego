import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { Bell, Moon, Sun, Trash2, Info } from 'lucide-react-native';
import { storage } from '@/lib/storage';
import { useTheme } from '@/lib/theme';

export default function SettingsScreen() {
  const { colors, isDark } = useTheme();
  const [notificationDays, setNotificationDays] = useState(3);
  const [isDarkMode, setIsDarkMode] = useState(isDark);

  useEffect(() => {
    setIsDarkMode(isDark);
  }, [isDark]);

  function updateNotificationDays(days: number) {
    setNotificationDays(days);
    Alert.alert('성공', `알림 주기가 ${days}일로 변경되었습니다.`);
  }

  function toggleTheme() {
    Alert.alert('안내', '테마 변경 기능은 추후 업데이트될 예정입니다.');
  }

  async function clearAllData() {
    Alert.alert('데이터 삭제', '모든 식재료 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            const ingredients = await storage.getIngredients();
            for (const ingredient of ingredients) {
              await storage.deleteIngredient(ingredient.id);
            }
            Alert.alert('완료', '모든 데이터가 삭제되었습니다.');
          } catch (error) {
            console.error('Error clearing data:', error);
            Alert.alert('오류', '데이터 삭제에 실패했습니다.');
          }
        },
      },
    ]);
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>설정</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>앱 설정 및 관리</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Bell size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>알림 설정</Text>
          </View>

          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>유통기한 알림 주기</Text>
            <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>유통기한 며칠 전부터 알림을 받을지 선택하세요</Text>

            <View style={styles.notificationOptions}>
              {[1, 2, 3, 5, 7].map((days) => (
                <TouchableOpacity
                  key={days}
                  style={[
                    styles.notificationOption,
                    { backgroundColor: colors.surfaceSecondary, borderColor: colors.border },
                    notificationDays === days && { backgroundColor: colors.primaryLight, borderColor: colors.primary },
                  ]}
                  onPress={() => updateNotificationDays(days)}>
                  <Text
                    style={[
                      styles.notificationOptionText,
                      { color: colors.textSecondary },
                      notificationDays === days && { color: colors.primary },
                    ]}>
                    {days}일
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            {isDarkMode ? <Moon size={20} color={colors.primary} /> : <Sun size={20} color={colors.primary} />}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>테마</Text>
          </View>

          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>다크 모드</Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>어두운 테마 사용</Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: '#d1d5db', true: '#86efac' }}
                thumbColor={isDarkMode ? '#10b981' : '#f3f4f6'}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Trash2 size={20} color={colors.danger} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>데이터 관리</Text>
          </View>

          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <TouchableOpacity style={styles.dangerButton} onPress={clearAllData}>
              <Trash2 size={20} color={colors.danger} />
              <Text style={[styles.dangerButtonText, { color: colors.danger }]}>모든 데이터 삭제</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Info size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>앱 정보</Text>
          </View>

          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>버전</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>1.0.0</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>개발자</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>냉장고 관리 팀</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>문의</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>support@fridge.app</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>냉장고 재고관리 앱</Text>
          <Text style={[styles.footerSubtext, { color: colors.textTertiary }]}>음식물 쓰레기를 줄이고 현명한 소비를</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  notificationOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  notificationOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  notificationOptionActive: {
    backgroundColor: '#d1fae5',
    borderColor: '#10b981',
  },
  notificationOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  notificationOptionTextActive: {
    color: '#10b981',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#9ca3af',
  },
});
