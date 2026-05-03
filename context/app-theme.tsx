import React, { createContext, useContext, useMemo } from 'react';

import { BrandPalette, DarkBrand } from '@/constants/brand-theme';
import { useResolvedTheme } from '@/hooks/use-theme';

export type AppThemeColors = {
  scheme: 'light' | 'dark';
  background: string;
  surface: string;
  card: string;
  text: string;
  textMuted: string;
  headerBg: string;
  headerText: string;
  border: string;
  tint: string;
  shadow: string;
  streak: string;
};

const AppThemeContext = createContext<AppThemeColors | null>(null);

function buildColors(scheme: 'light' | 'dark'): AppThemeColors {
  if (scheme === 'dark') {
    return {
      scheme: 'dark',
      background: DarkBrand.background,
      surface: DarkBrand.surface,
      card: DarkBrand.card,
      text: DarkBrand.ink,
      textMuted: DarkBrand.inkMuted,
      headerBg: BrandPalette.tealDark,
      headerText: BrandPalette.headerText,
      border: DarkBrand.border,
      tint: BrandPalette.teal,
      shadow: DarkBrand.shadow,
      streak: BrandPalette.streakFire,
    };
  }
  return {
    scheme: 'light',
    background: BrandPalette.mintSurface,
    surface: BrandPalette.mintSurfaceAlt,
    card: BrandPalette.card,
    text: BrandPalette.ink,
    textMuted: BrandPalette.inkMuted,
    headerBg: BrandPalette.teal,
    headerText: BrandPalette.headerText,
    border: BrandPalette.border,
    tint: BrandPalette.teal,
    shadow: BrandPalette.shadow,
    streak: BrandPalette.streakFire,
  };
}

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const scheme = useResolvedTheme();
  const value = useMemo(() => buildColors(scheme), [scheme]);
  return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>;
}

export function useAppTheme(): AppThemeColors {
  const ctx = useContext(AppThemeContext);
  if (!ctx) {
    throw new Error('useAppTheme must be used within AppThemeProvider');
  }
  return ctx;
}
