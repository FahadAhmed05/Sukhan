import { quotesCatalogHash } from '@/lib/quote-helpers';
import { notifyNewQuotesIfNeeded } from '@/services/notifications';
import { useSukhanStore } from '@/store/sukhan-store';
import type { Quote } from '@/types/quote';

/**
 * First successful load: seed seen IDs, no notification.
 * Later loads: if Firebase returns new keys, local notification (when enabled).
 */
export async function runQuoteCatalogSync(all: Quote[]): Promise<void> {
  const {
    seenQuoteIds,
    lastQuoteCatalogHash,
    notificationsEnabled,
    markQuotesSeen,
    setQuoteCatalogHash,
  } = useSukhanStore.getState();

  const allIds = all.map((q) => q.id);
  const hash = quotesCatalogHash(all);
  const firstSync = lastQuoteCatalogHash === '';

  if (firstSync) {
    markQuotesSeen(allIds);
    setQuoteCatalogHash(hash);
    return;
  }

  const unseen = all.filter((q) => !seenQuoteIds.includes(q.id));
  const catalogChanged = hash !== lastQuoteCatalogHash;

  if (unseen.length > 0 && catalogChanged) {
    await notifyNewQuotesIfNeeded(all, seenQuoteIds, notificationsEnabled);
  }

  markQuotesSeen(allIds);
  setQuoteCatalogHash(hash);
}
