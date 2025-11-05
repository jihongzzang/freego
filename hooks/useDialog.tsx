import { useState } from 'react';
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

export function useDialog() {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<DialogOptions>({
    title: '',
    message: '',
    type: 'default',
    buttons: [],
  });

  function showDialog(dialogOptions: DialogOptions) {
    setOptions(dialogOptions);
    setVisible(true);
  }

  function hideDialog() {
    setVisible(false);
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
    onConfirm: () => void;
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
            onConfirm();
            hideDialog();
          },
        },
      ],
    });
  }

  const DialogComponent = () => (
    <Dialog
      visible={visible}
      title={options.title}
      message={options.message}
      type={options.type}
      buttons={options.buttons}
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
