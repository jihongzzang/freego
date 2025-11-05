import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Dialog } from '@/components/Dialog';

interface DialogButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface DialogOptions {
  title?: string;
  message: string;
  type?: 'default' | 'success' | 'warning' | 'error' | 'info';
  buttons: DialogButton[];
}

interface DialogState extends DialogOptions {
  visible: boolean;
}

interface DialogContextType {
  alert: (options: {
    title: string;
    message: string;
    type?: 'success' | 'warning' | 'error' | 'info';
  }) => void;
  confirm: (options: {
    title?: string;
    message: string;
    onConfirm: () => void | Promise<void>;
    onCancel?: () => void;
    confirmText: string;
    cancelText: string;
    isDestructive?: boolean;
  }) => void;
  showDialog: (options: DialogOptions) => void;
  hideDialog: () => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function DialogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DialogState>({
    visible: false,
    title: '',
    message: '',
    type: 'default',
    buttons: [],
  });

  console.log('[DialogProvider] Render - visible:', state.visible);

  const hideDialog = useCallback(() => {
    console.log('[DialogProvider] hideDialog called');
    setState((prev) => ({ ...prev, visible: false }));
  }, []);

  const showDialog = useCallback((dialogOptions: DialogOptions) => {
    console.log('[DialogProvider] showDialog called');
    setState({
      ...dialogOptions,
      visible: true,
    });
  }, []);

  const alert = useCallback(({
    title,
    message,
    type,
  }: {
    title: string;
    message: string;
    type?: 'success' | 'warning' | 'error' | 'info';
  }) => {
    showDialog({
      title,
      message,
      type,
      buttons: [
        {
          text: '확인',
          onPress: hideDialog,
        },
      ],
    });
  }, [showDialog, hideDialog]);

  const confirm = useCallback(({
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = '확인',
    cancelText = '취소',
    isDestructive = false,
  }: {
    title?: string;
    message: string;
    onConfirm: () => void | Promise<void>;
    onCancel?: () => void;
    confirmText: string;
    cancelText: string;
    isDestructive?: boolean;
  }) => {
    showDialog({
      title,
      message,
      buttons: [
        {
          text: cancelText,
          style: 'cancel',
          onPress: () => {
            if (onCancel) onCancel();
            hideDialog();
          },
        },
        {
          text: confirmText,
          style: isDestructive ? 'destructive' : 'default',
          onPress: () => {
            hideDialog();
            setTimeout(() => {
              onConfirm();
            }, 100);
          },
        },
      ],
    });
  }, [showDialog, hideDialog]);

  return (
    <DialogContext.Provider
      value={{ alert, confirm, showDialog, hideDialog }}
    >
      {children}
      <Dialog
        visible={state.visible}
        title={state.title}
        message={state.message}
        type={state.type}
        buttons={state.buttons}
        onClose={hideDialog}
      />
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
}
