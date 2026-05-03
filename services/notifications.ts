/**
 * Local notifications use `expo-notifications` — the supported path for Expo SDK.
 * (`react-native-push-notification` targets bare React Native; same product outcome here.)
 */
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import type { Quote } from '@/types/quote';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function ensureNotificationPermissions(): Promise<boolean> {
  const existing = await Notifications.getPermissionsAsync();
  if (existing.status === 'granted') return true;
  const req = await Notifications.requestPermissionsAsync();
  return req.status === 'granted';
}

function summarizeNewByCategory(newQuotes: Quote[]): string {
  const map = new Map<string, number>();
  for (const q of newQuotes) {
    map.set(q.category, (map.get(q.category) ?? 0) + 1);
  }
  const parts = Array.from(map.entries()).map(([cat, n]) => `${n} in ${cat}`);
  return parts.join(', ');
}

export async function notifyNewQuotesIfNeeded(
  allQuotes: Quote[],
  seenIds: string[],
  notificationsEnabled: boolean,
): Promise<void> {
  if (!notificationsEnabled || Platform.OS === 'web') return;
  const granted = await ensureNotificationPermissions();
  if (!granted) return;

  const seen = new Set(seenIds);
  const fresh = allQuotes.filter((q) => !seen.has(q.id));
  if (fresh.length === 0) return;

  const body =
    fresh.length === 1
      ? `1 new quote added in ${fresh[0].category}`
      : `${fresh.length} new quotes: ${summarizeNewByCategory(fresh)}`;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Sukhan — fresh quotes',
      body,
      sound: Platform.OS === 'ios' ? 'default' : undefined,
    },
    trigger: null,
  });
}
