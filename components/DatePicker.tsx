import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState, useMemo } from 'react';
import { useTheme } from '@/lib/theme';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

interface DatePickerProps {
  value?: Date;
  onDateSelect: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
}

export default function DatePicker({ value, onDateSelect, minimumDate, maximumDate }: DatePickerProps) {
  const { colors, typography, spacing, borderRadius } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(
    value
      ? new Date(value.getFullYear(), value.getMonth(), 1)
      : new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );

  const styles = useMemo(() => createStyles({ spacing, borderRadius }), [spacing, borderRadius]);

  // 달력 데이터 생성
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // 이번 달의 첫날과 마지막 날
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // 첫 주의 빈 칸 (일요일=0 기준)
    const firstDayOfWeek = firstDay.getDay();

    // 마지막 날짜
    const lastDate = lastDay.getDate();

    const days: (Date | null)[] = [];

    // 앞쪽 빈 칸
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    // 실제 날짜들
    for (let date = 1; date <= lastDate; date++) {
      days.push(new Date(year, month, date));
    }

    return days;
  }, [currentMonth]);

  // 이전 달로 이동
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // 다음 달로 이동
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // 날짜 선택 가능 여부 확인 (시간 제거하고 비교)
  const isDateDisabled = (date: Date) => {
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (minimumDate) {
      const minDateOnly = new Date(minimumDate.getFullYear(), minimumDate.getMonth(), minimumDate.getDate());
      if (dateOnly < minDateOnly) {
        return true;
      }
    }

    if (maximumDate) {
      const maxDateOnly = new Date(maximumDate.getFullYear(), maximumDate.getMonth(), maximumDate.getDate());
      if (dateOnly > maxDateOnly) {
        return true;
      }
    }

    return false;
  };

  // 날짜가 선택된 날짜인지 확인
  const isDateSelected = (date: Date) => {
    if (!value) return false;
    return (
      date.getFullYear() === value.getFullYear() &&
      date.getMonth() === value.getMonth() &&
      date.getDate() === value.getDate()
    );
  };

  // 오늘 날짜인지 확인
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* 헤더: 월/년 표시 및 네비게이션 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goToPreviousMonth} style={styles.navButton}>
          <ChevronLeft size={20} color={colors.text} />
        </TouchableOpacity>

        <Text style={[typography.styles.h6, { color: colors.text }]}>
          {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
        </Text>

        <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
          <ChevronRight size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* 요일 헤더 */}
      <View style={styles.weekHeader}>
        {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
          <View key={day} style={styles.weekDay}>
            <Text
              style={[
                typography.styles.captionBold,
                {
                  color: index === 0 ? colors.danger : index === 6 ? colors.primary : colors.textSecondary,
                },
              ]}
            >
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* 날짜 그리드 */}
      <View style={styles.daysGrid}>
        {calendarDays.map((date, index) => {
          if (!date) {
            return <View key={`empty-${index}`} style={styles.dayCell} />;
          }

          const disabled = isDateDisabled(date);
          const selected = isDateSelected(date);
          const today = isToday(date);
          const dayOfWeek = date.getDay();

          // 텍스트 색상 결정
          let textColor = colors.text;
          if (selected) {
            textColor = '#FFFFFF';
          } else if (disabled) {
            textColor = colors.textTertiary;
          } else if (dayOfWeek === 0) {
            textColor = colors.danger;
          } else if (dayOfWeek === 6) {
            textColor = colors.primary;
          }

          return (
            <TouchableOpacity
              key={date ? `date-${date.toDateString()}` : `empty-${index}`}
              style={styles.dayCell}
              onPress={() => !disabled && onDateSelect(date)}
              disabled={disabled}
            >
              <View
                style={[
                  styles.dayCellInner,
                  selected && {
                    backgroundColor: colors.primary,
                  },
                  today &&
                    !selected && {
                      borderWidth: 2,
                      borderColor: colors.primary,
                    },
                ]}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: textColor,
                    fontWeight: selected ? '600' : '400',
                    textAlign: 'center',
                  }}
                >
                  {date.getDate()}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const createStyles = ({
  spacing,
  borderRadius,
}: {
  spacing: typeof import('@/lib/theme').spacing;
  borderRadius: typeof import('@/lib/theme').borderRadius;
}) =>
  StyleSheet.create({
    container: {
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      gap: spacing.md,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: spacing.sm,
    },
    navButton: {
      padding: spacing.xs,
    },
    weekHeader: {
      flexDirection: 'row',
      paddingBottom: spacing.sm,
    },
    weekDay: {
      width: '14.28%', // 100% / 7 = 14.28%
      alignItems: 'center',
      justifyContent: 'center',
      height: 32,
    },
    daysGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    dayCell: {
      width: '14.28%', // 100% / 7 = 14.28%
      height: 48,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dayCellInner: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
