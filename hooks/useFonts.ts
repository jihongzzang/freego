import { useEffect, useState } from 'react';
import * as Font from 'expo-font';

export function useFonts() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'Pretendard-Regular': require('../assets/fonts/Pretendard-Regular.otf'),
          'Pretendard-Medium': require('../assets/fonts/Pretendard-Medium.otf'),
          'Pretendard-SemiBold': require('../assets/fonts/Pretendard-SemiBold.otf'),
          'Pretendard-Bold': require('../assets/fonts/Pretendard-Bold.otf'),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
        setFontsLoaded(true); // 폰트 로딩 실패해도 앱은 실행되도록
      }
    }

    loadFonts();
  }, []);

  return fontsLoaded;
}
