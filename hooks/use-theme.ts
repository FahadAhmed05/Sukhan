import { useColorScheme } from 'react-native';

import { useSukhanStore } from '@/store/sukhan-store';

export type ResolvedScheme = 'light' | 'dark';

export function useResolvedTheme(): ResolvedScheme {
  const system = useColorScheme();
  const pref = useSukhanStore((s) => s.themePreference);
  if (pref === 'dark') return 'dark';
  if (pref === 'light') return 'light';
  return system === 'dark' ? 'dark' : 'light';
}
