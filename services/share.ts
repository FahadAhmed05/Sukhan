import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import { Share, Platform } from 'react-native';

import { useSukhanStore } from '@/store/sukhan-store';

export async function copyQuote(text: string): Promise<void> {
  await Clipboard.setStringAsync(text);
  useSukhanStore.getState().recordCopy();
}

export async function shareQuote(text: string): Promise<void> {
  try {
    await Share.share(
      { message: text, title: 'Sukhan' },
      Platform.OS === 'ios' ? { subject: 'Urdu quote' } : undefined,
    );
  } catch {
    /* user dismissed */
  }
}

export async function openWhatsAppStatus(text: string): Promise<void> {
  const encoded = encodeURIComponent(text);
  const app = `whatsapp://send?text=${encoded}`;
  const web = `https://wa.me/?text=${encoded}`;
  const can = await Linking.canOpenURL(app);
  await Linking.openURL(can ? app : web);
}
