import bundled from '@/data/quotes.json';
import { normalizeCategory } from '@/lib/quote-helpers';
import type { Quote } from '@/types/quote';

type BundledRow = { id: number; category: string; text: string };

/** Offline fallback: local JSON (numeric ids coerced to string). */
export function getBundledQuotes(): Quote[] {
  const rows = (bundled as { quotes: BundledRow[] }).quotes;
  return rows.map((row) => ({
    id: String(row.id),
    category: normalizeCategory(row.category),
    text: String(row.text ?? ''),
  }));
}
