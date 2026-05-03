import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { getBundledQuotes } from '@/lib/bundled-quotes';
import { runQuoteCatalogSync } from '@/services/quote-sync';
import { fetchQuotesFromFirebase } from '@/services/quotes-api';
import type { Quote } from '@/types/quote';

export type QuotesCatalogSource = 'remote' | 'bundled';

type QuotesCatalogValue = {
  quotes: Quote[];
  loading: boolean;
  error: string | null;
  source: QuotesCatalogSource;
  refresh: () => Promise<void>;
};

const QuotesCatalogContext = createContext<QuotesCatalogValue | null>(null);

export function QuotesCatalogProvider({ children }: { children: React.ReactNode }) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<QuotesCatalogSource>('remote');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const remote = await fetchQuotesFromFirebase();
      let list = remote;
      let src: QuotesCatalogSource = 'remote';
      if (list.length === 0) {
        list = getBundledQuotes();
        src = 'bundled';
      }
      setQuotes(list);
      setSource(src);
      await runQuoteCatalogSync(list);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Could not load quotes';
      setError(message);
      const fallback = getBundledQuotes();
      setQuotes(fallback);
      setSource('bundled');
      await runQuoteCatalogSync(fallback);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({ quotes, loading, error, source, refresh }),
    [quotes, loading, error, source, refresh],
  );

  return <QuotesCatalogContext.Provider value={value}>{children}</QuotesCatalogContext.Provider>;
}

export function useQuotesCatalog(): QuotesCatalogValue {
  const ctx = useContext(QuotesCatalogContext);
  if (!ctx) {
    throw new Error('useQuotesCatalog must be used within QuotesCatalogProvider');
  }
  return ctx;
}
