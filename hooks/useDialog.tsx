import { useState } from 'react';
import { Dialog } from '@/components/ui/Dialog';

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

export function useDialog() {
  const [state, setState] = useState<DialogState>({
    visible: false,
    title: '',
    message: '',
    type: 'default',
    buttons: [],
  });

  function showDialog(dialogOptions: DialogOptions) {
    setState({
      ...dialogOptions,
      visible: true,
    });
  }

  function hideDialog() {
    setState((prev) => ({ ...prev, visible: false }));
  }

  function alert({
    title,
    message,
    type,
  }: {
    title: string;
    message: string;
    type?: 'success' | 'warning' | 'error' | 'info';
  }) {
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
  }

  function confirm({
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
  }) {
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
            // 다이얼로그가 닫힌 후 onConfirm 실행
            setTimeout(() => {
              onConfirm();
            }, 100);
          },
        },
      ],
    });
  }

  const DialogComponent = () => (
    <Dialog
      visible={state.visible}
      title={state.title}
      message={state.message}
      type={state.type}
      buttons={state.buttons}
      onClose={hideDialog}
    />
  );

  return {
    alert,
    confirm,
    showDialog,
    hideDialog,
    DialogComponent,
  };
}
