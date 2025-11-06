import { useState } from 'react';

interface UseUnitPickerProps {
  onUnitChange: (unitId: string) => void;
}

export function useUnitPicker({ onUnitChange }: UseUnitPickerProps) {
  const [visible, setVisible] = useState(false);

  const open = () => setVisible(true);
  const close = () => setVisible(false);

  const handleUnitSelect = (unitId: string) => {
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
