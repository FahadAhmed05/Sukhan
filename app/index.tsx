import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { BrandPalette } from '@/constants/brand-theme';
import { FontUi } from '@/constants/fonts';

const SPLASH_MS = 900;

export default function SplashScreenRoute() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      router.replace('/(tabs)');
    }, SPLASH_MS);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <View style={styles.root} accessibilityLabel="Sukhan splash">
      <Text style={[styles.title, { fontFamily: FontUi.bold }]}>Sukhan</Text>
      <Text style={[styles.tag, { fontFamily: FontUi.medium }]}>Urdu quotes & insights</Text>
      <ActivityIndicator size="large" color={BrandPalette.headerText} style={styles.spinner} />
      <Text style={[styles.hint, { fontFamily: FontUi.regular }]}>Loading your library…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BrandPalette.teal,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 36,
    color: BrandPalette.headerText,
    letterSpacing: 0.5,
  },
  tag: {
    marginTop: 8,
    fontSize: 16,
    color: BrandPalette.headerText,
    opacity: 0.92,
  },
  spinner: { marginTop: 32 },
  hint: {
    marginTop: 16,
    fontSize: 14,
    color: BrandPalette.headerText,
    opacity: 0.85,
  },
});
