import {
  NotoNaskhArabic_400Regular,
  NotoNaskhArabic_600SemiBold,
} from '@expo-google-fonts/noto-naskh-arabic';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';

export const FontAssets = {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  NotoNaskhArabic_400Regular,
  NotoNaskhArabic_600SemiBold,
} as const;

/** UI labels, navigation, analytics — clean geometric sans */
export const FontUi = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
} as const;

/** Urdu body for quotes — strong Naskh coverage for Urdu/Arabic script */
export const FontUrdu = {
  regular: 'NotoNaskhArabic_400Regular',
  semibold: 'NotoNaskhArabic_600SemiBold',
} as const;
