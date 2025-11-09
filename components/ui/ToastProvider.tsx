import React, { createContext, useContext, useState, useCallback, useRef, useMemo } from 'react';
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
  const [toast, setToast] = useState<(ToastOptions & { visible: boolean; id: number }) | null>(null);
  const toastIdRef = useRef(0);

  const showToast = useCallback((options: ToastOptions) => {
    // 고유 ID를 생성하여 매번 새로운 토스트로 인식되도록 함
    toastIdRef.current += 1;
    setToast({
      ...options,
      visible: true,
      id: toastIdRef.current,
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => (prev ? { ...prev, visible: false } : null));
  }, []);

  const contextValue = useMemo(() => ({ showToast, hideToast }), [showToast, hideToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {toast && (
        <Toast
          key={toast.id}
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
