import { Modal, View, Text, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { useTheme } from '@/lib/theme';
import { Achievement } from '@/data/models/achievement.model';
import { Button } from './ui';

interface BadgeModalProps {
  visible: boolean;
  achievement: Achievement | null;
  onClose: () => void;
}

export default function BadgeModal({ visible, achievement, onClose }: BadgeModalProps) {
  const { colors, typography, spacing, borderRadius } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // 등장 애니메이션
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // 퇴장 애니메이션
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
    }
  }, [visible, scaleAnim, fadeAnim]);

  if (!achievement) return null;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <Animated.View
          style={[
            styles.container,
            {
              backgroundColor: colors.background,
              borderRadius: borderRadius.xl,
              padding: spacing.xl,
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* 축하 텍스트 */}
          <Text style={[typography.styles.t3Semibold, { color: colors.textSecondary, textAlign: 'center' }]}>
            축하합니다! 🎉
          </Text>

          {/* 뱃지 이미지 */}
          <View style={styles.badgeContainer}>
            <Image source={achievement.badge_image} style={styles.badgeImage} resizeMode="contain" />
          </View>

          {/* 업적 정보 */}
          <Text style={[typography.styles.t3Semibold, { color: colors.textSecondary, textAlign: 'center' }]}>
            {achievement.title}
          </Text>
          <Text
            style={[typography.styles.t6, { color: colors.textTertiary, textAlign: 'center', marginTop: spacing.xs }]}
          >
            {achievement.description}
          </Text>

          {/* 닫기 버튼 */}
          <Button
            size="large"
            fullWidth
            style={{
              marginTop: spacing.xl,
            }}
            onPress={onClose}
          >
            확인
          </Button>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
  },
  badgeContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  badgeImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    width: '100%',
  },
});
