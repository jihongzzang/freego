import { useState } from 'react';
import { Unit } from '@/data/enums/unit';

interface UseUnitPickerProps {
  onUnitChange: (unitId: Unit) => void;
}

export function useUnitPicker({ onUnitChange }: UseUnitPickerProps) {
  const [visible, setVisible] = useState(false);

  const open = () => setVisible(true);
  const close = () => setVisible(false);

  const handleUnitSelect = (unitId: Unit) => {
    onUnitChange(unitId);
    close();
  };

  return {
    visible,
    open,
    close,
    handleUnitSelect,
  };
}
