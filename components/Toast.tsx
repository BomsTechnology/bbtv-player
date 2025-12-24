import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  visible: boolean;
  duration?: number;
  onHide?: () => void;
  position?: 'top' | 'bottom';
}

const Toast = ({
  message,
  type = 'success',
  visible,
  duration = 2000,
  onHide,
  position = 'top',
}: ToastProps) => {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible && duration > 0) {
      const timer = setTimeout(() => {
        onHide?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onHide]);

  if (!visible) return null;

  const getIconConfig = () => {
    switch (type) {
      case 'success':
        return { name: 'checkmark-circle' as const, color: '#4CAF50' };
      case 'error':
        return { name: 'close-circle' as const, color: '#F44336' };
      case 'warning':
        return { name: 'warning' as const, color: '#FF9800' };
      case 'info':
        return { name: 'information-circle' as const, color: '#2196F3' };
      default:
        return { name: 'checkmark-circle' as const, color: '#4CAF50' };
    }
  };

  const iconConfig = getIconConfig();
  const topPosition = position === 'top' ? insets.top + 60 : undefined;
  const bottomPosition = position === 'bottom' ? insets.bottom + 20 : undefined;

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      style={[
        styles.toast,
        {
          top: topPosition,
          bottom: bottomPosition,
        },
      ]}
    >
      <Ionicons name={iconConfig.name} size={20} color={iconConfig.color} />
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    zIndex: 9999,
  },
  toastText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
});

export default Toast;
