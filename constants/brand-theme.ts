/**
 * Visual language aligned with teal header + mint surface (reference UI).
 */
export const BrandPalette = {
  teal: '#008080',
  tealPressed: '#006666',
  tealDark: '#00796B',
  mintSurface: '#E0F2F1',
  mintSurfaceAlt: '#F0F8F7',
  headerText: '#FFFFFF',
  ink: '#0D3D3C',
  inkMuted: '#4A6B6A',
  card: '#FFFFFF',
  border: 'rgba(0, 128, 128, 0.12)',
  shadow: 'rgba(0, 77, 77, 0.12)',
  danger: '#C62828',
  streakFire: '#FF6B35',
} as const;

export const DarkBrand = {
  background: '#0B1615',
  surface: '#122422',
  card: '#152A28',
  ink: '#E8F5F4',
  inkMuted: '#9BB0AE',
  border: 'rgba(224, 242, 241, 0.12)',
  shadow: 'rgba(0, 0, 0, 0.35)',
} as const;

export type ThemeMode = 'light' | 'dark';
