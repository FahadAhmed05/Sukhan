import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { QuoteCategory } from '@/types/quote';
import { dayKey, previousDayKey } from '@/lib/date';

export type ThemePreference = 'light' | 'dark' | 'system';

type SukhanState = {
  favoriteIds: string[];
  seenQuoteIds: string[];
  /** Empty string until first successful catalog sync (local or remote). */
  lastQuoteCatalogHash: string;
  categoryViews: Record<string, number>;
  favoritesByCategory: Record<string, number>;
  copyCount: number;
  dailyAppOpens: Record<string, number>;
  lastStreakDay: string | null;
  currentStreak: number;
  bestStreak: number;
  themePreference: ThemePreference;
  notificationsEnabled: boolean;
  hasCompletedOnboardingHints: boolean;

  toggleFavorite: (id: string, category: QuoteCategory) => void;
  recordCategoryOpen: (category: QuoteCategory) => void;
  recordCopy: () => void;
  recordAppSession: () => void;
  setThemePreference: (pref: ThemePreference) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  markQuotesSeen: (ids: string[]) => void;
  setQuoteCatalogHash: (hash: string) => void;
  dismissOnboardingHints: () => void;
};

function bumpStreak(state: SukhanState, today: string): Pick<SukhanState, 'lastStreakDay' | 'currentStreak' | 'bestStreak'> {
  if (state.lastStreakDay === today) {
    return {
      lastStreakDay: state.lastStreakDay,
      currentStreak: state.currentStreak,
      bestStreak: state.bestStreak,
    };
  }
  let next = 1;
  if (state.lastStreakDay === previousDayKey(today)) {
    next = state.currentStreak + 1;
  }
  return {
    lastStreakDay: today,
    currentStreak: next,
    bestStreak: Math.max(state.bestStreak, next),
  };
}

export const useSukhanStore = create<SukhanState>()(
  persist(
    (set) => ({
      favoriteIds: [],
      seenQuoteIds: [],
      lastQuoteCatalogHash: '',
      categoryViews: {},
      favoritesByCategory: {},
      copyCount: 0,
      dailyAppOpens: {},
      lastStreakDay: null,
      currentStreak: 0,
      bestStreak: 0,
      themePreference: 'system',
      notificationsEnabled: true,
      hasCompletedOnboardingHints: false,

      toggleFavorite: (id, category) => {
        set((s) => {
          const exists = s.favoriteIds.includes(id);
          const cat = category;
          const prevCatCount = s.favoritesByCategory[cat] ?? 0;
          const nextFavoritesByCategory = { ...s.favoritesByCategory };
          if (exists) {
            nextFavoritesByCategory[cat] = Math.max(0, prevCatCount - 1);
            if (nextFavoritesByCategory[cat] === 0) delete nextFavoritesByCategory[cat];
            return {
              favoriteIds: s.favoriteIds.filter((x) => x !== id),
              favoritesByCategory: nextFavoritesByCategory,
            };
          }
          nextFavoritesByCategory[cat] = prevCatCount + 1;
          return {
            favoriteIds: [...s.favoriteIds, id],
            favoritesByCategory: nextFavoritesByCategory,
          };
        });
      },

      recordCategoryOpen: (category) => {
        set((s) => ({
          categoryViews: {
            ...s.categoryViews,
            [category]: (s.categoryViews[category] ?? 0) + 1,
          },
        }));
      },

      recordCopy: () => {
        set((s) => ({ copyCount: s.copyCount + 1 }));
      },

      recordAppSession: () => {
        const today = dayKey();
        set((s) => {
          const opensToday = s.dailyAppOpens[today] ?? 0;
          const streakPatch =
            opensToday === 0
              ? bumpStreak(s, today)
              : {
                  lastStreakDay: s.lastStreakDay,
                  currentStreak: s.currentStreak,
                  bestStreak: s.bestStreak,
                };
          return {
            dailyAppOpens: { ...s.dailyAppOpens, [today]: opensToday + 1 },
            ...streakPatch,
          };
        });
      },

      setThemePreference: (pref) => set({ themePreference: pref }),
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),

      markQuotesSeen: (ids) => {
        set((s) => {
          const merged = new Set([...s.seenQuoteIds, ...ids]);
          return { seenQuoteIds: Array.from(merged) };
        });
      },

      setQuoteCatalogHash: (hash) => set({ lastQuoteCatalogHash: hash }),

      dismissOnboardingHints: () => set({ hasCompletedOnboardingHints: true }),
    }),
    {
      name: 'sukhan-store-v2',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        favoriteIds: s.favoriteIds,
        seenQuoteIds: s.seenQuoteIds,
        lastQuoteCatalogHash: s.lastQuoteCatalogHash,
        categoryViews: s.categoryViews,
        favoritesByCategory: s.favoritesByCategory,
        copyCount: s.copyCount,
        dailyAppOpens: s.dailyAppOpens,
        lastStreakDay: s.lastStreakDay,
        currentStreak: s.currentStreak,
        bestStreak: s.bestStreak,
        themePreference: s.themePreference,
        notificationsEnabled: s.notificationsEnabled,
        hasCompletedOnboardingHints: s.hasCompletedOnboardingHints,
      }),
    },
  ),
);
