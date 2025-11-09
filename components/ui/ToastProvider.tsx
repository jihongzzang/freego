import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastType, ToastPosition } from './Toast';

interface ToastOptions {
  message: string;
  type?: ToastType;
  position?: ToastPosition;
  duration?: number;
}

interface ToastContextType {
  showToast: (options: ToastOptions) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<(ToastOptions & { visible: boolean }) | null>(null);

  const showToast = useCallback((options: ToastOptions) => {
    setToast({
      ...options,
      visible: true,
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => (prev ? { ...prev, visible: false } : null));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast && (
        <Toast
          visible={toast.visible}
          message={toast.message}
          type={toast.type}
          position={toast.position}
          duration={toast.duration}
          onHide={hideToast}
        />
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
