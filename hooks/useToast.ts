import { ToastType } from '@/components/Toast';
import { useCallback, useState } from 'react';

interface UseToastReturn {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  hideToast: () => void;
  toastVisible: boolean;
  toastMessage: string;
  toastType: ToastType;
}

export const useToast = (): UseToastReturn => {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<ToastType>('success');

  const showToast = useCallback((message: string, type: ToastType = 'success', duration = 2000) => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  }, []);

  const hideToast = useCallback(() => {
    setToastVisible(false);
  }, []);

  return {
    showToast,
    hideToast,
    toastVisible,
    toastMessage,
    toastType,
  };
};
