import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import {
  NotoNaskhArabic_400Regular,
  NotoNaskhArabic_600SemiBold,
} from '@expo-google-fonts/noto-naskh-arabic';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { AppThemeProvider } from '@/context/app-theme';
import { QuotesCatalogProvider } from '@/context/QuotesCatalogContext';
import { useStoreHydration } from '@/hooks/use-store-hydration';
import { useSukhanStore } from '@/store/sukhan-store';

SplashScreen.preventAutoHideAsync();

const fontMap = {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  NotoNaskhArabic_400Regular,
  NotoNaskhArabic_600SemiBold,
};

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts(fontMap);
  const hydrated = useStoreHydration();
  const ready = fontsLoaded && hydrated;

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync();
      useSukhanStore.getState().recordAppSession();
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
    <AppThemeProvider>
      <QuotesCatalogProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="category/[slug]" />
          <Stack.Screen name="search" />
        </Stack>
        <StatusBar style="auto" />
      </QuotesCatalogProvider>
    </AppThemeProvider>
  );
}
