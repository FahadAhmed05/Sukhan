import { CATEGORY_ORDER } from '@/constants/categories';
import { dayKey } from '@/lib/date';
import type { Quote, QuoteCategory } from '@/types/quote';

const CATEGORY_SET = new Set<string>(CATEGORY_ORDER);

export function normalizeCategory(raw: unknown): QuoteCategory {
  const c = String(raw ?? '').trim();
  if (CATEGORY_SET.has(c)) return c as QuoteCategory;
  return 'Life';
}

export function quotesCatalogHash(quotes: Quote[]): string {
  return [...new Set(quotes.map((q) => q.id))].sort().join('|');
}

export function getQuotesByCategory(quotes: Quote[], category: QuoteCategory): Quote[] {
  return quotes.filter((q) => q.category === category);
}

export function getQuoteById(quotes: Quote[], id: string): Quote | undefined {
  return quotes.find((q) => q.id === id);
}

export function searchQuotes(quotes: Quote[], query: string): Quote[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return quotes.filter((item) => item.text.toLowerCase().includes(q));
}

export function getQuoteOfTheDay(quotes: Quote[], date: Date = new Date()): Quote | null {
  if (quotes.length === 0) return null;
  const seed = dayKey(date);
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  const idx = Math.abs(hash) % quotes.length;
  return quotes[idx];
}
