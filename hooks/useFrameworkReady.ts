import { useEffect } from 'react';
import { Platform } from 'react-native';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export function useFrameworkReady() {
  useEffect(() => {
    // 웹 플랫폼에서만 실행
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.frameworkReady?.();
    }
  }, []);
}
