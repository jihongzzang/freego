import { useState, useEffect, useRef } from 'react';

interface UseExpiryDatePickerProps {
  onDateConfirm: (formattedDate: string) => void;
}

export function useExpiryDatePicker({ onDateConfirm }: UseExpiryDatePickerProps) {
  const [visible, setVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const pendingDateRef = useRef<Date | string | null>(null);

  // 바텀시트가 열릴 때 날짜 설정
  useEffect(() => {
    if (visible && pendingDateRef.current) {
      const date = pendingDateRef.current;
      if (typeof date === 'string') {
        setSelectedDate(new Date(date));
      } else {
        setSelectedDate(date);
      }
      pendingDateRef.current = null;
    }
  }, [visible]);

  // Date를 YYYY-MM-DD 포맷으로 변환
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const open = (date?: Date | string) => {
    // 날짜를 ref에 저장하고 바텀시트 열기
    if (date) {
      pendingDateRef.current = date;
    } else {
      pendingDateRef.current = new Date();
    }
    setVisible(true);
  };

  const close = () => setVisible(false);

  // 날짜 선택 핸들러
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  // 확인 버튼 핸들러
  const handleConfirm = () => {
    const formattedDate = formatDate(selectedDate);
    onDateConfirm(formattedDate);
    close();
  };

  return {
    visible,
    open,
    close,
    selectedDate,
    handleDateChange,
    handleConfirm,
  };
}
