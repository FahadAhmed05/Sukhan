import { FIREBASE_DOMAIN } from '@/constants/firebase';
import { normalizeCategory } from '@/lib/quote-helpers';
import type { Comment, Quote, QuotesMeta } from '@/types/quote';

type FirebaseRecord<T> = Record<string, T | null | undefined> | null;

function parseJsonSafely(text: string): unknown {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

function recordErrorMessage(data: unknown, fallback: string): string {
  if (data && typeof data === 'object' && 'error' in data) {
    return String((data as { error: unknown }).error);
  }
  return fallback;
}

type RawQuoteRow = { category?: unknown; text?: unknown };

function rowToQuote(id: string, row: RawQuoteRow): Quote {
  return {
    id,
    category: normalizeCategory(row.category),
    text: String(row.text ?? '').trim() || '—',
  };
}

export async function fetchQuotesFromFirebase(): Promise<Quote[]> {
  const response = await fetch(`${FIREBASE_DOMAIN}/quotes.json`);
  const rawText = await response.text();
  const data = parseJsonSafely(rawText) as FirebaseRecord<RawQuoteRow>;

  if (!response.ok) {
    throw new Error(recordErrorMessage(data, 'Could not fetch quotes.'));
  }

  if (data == null || typeof data !== 'object') {
    return [];
  }

  const transformed: Quote[] = [];
  for (const key of Object.keys(data)) {
    const row = data[key];
    if (row == null || typeof row !== 'object') continue;
    transformed.push(rowToQuote(key, row as RawQuoteRow));
  }
  return transformed;
}

export async function fetchQuotesMetaFromFirebase(): Promise<QuotesMeta> {
  const response = await fetch(`${FIREBASE_DOMAIN}/meta.json`);
  if (!response.ok) return {};
  const data = (await response.json()) as unknown;
  if (data && typeof data === 'object') return data as QuotesMeta;
  return {};
}

export async function fetchSingleQuoteFromFirebase(quoteId: string): Promise<Quote | null> {
  const response = await fetch(`${FIREBASE_DOMAIN}/quotes/${encodeURIComponent(quoteId)}.json`);
  const data = (await response.json()) as RawQuoteRow | null;

  if (!response.ok) {
    throw new Error('Could not fetch quote.');
  }
  if (data == null || typeof data !== 'object') return null;
  return rowToQuote(quoteId, data);
}

export type NewQuotePayload = Omit<Quote, 'id'>;

export async function addQuoteToFirebase(quoteData: NewQuotePayload): Promise<string> {
  const response = await fetch(`${FIREBASE_DOMAIN}/quotes.json`, {
    method: 'POST',
    body: JSON.stringify({
      category: quoteData.category,
      text: quoteData.text,
    }),
    headers: { 'Content-Type': 'application/json' },
  });
  const data = (await response.json()) as { name?: string; error?: unknown };

  if (!response.ok) {
    throw new Error(recordErrorMessage(data, 'Could not create quote.'));
  }
  if (!data?.name) {
    throw new Error('Could not create quote.');
  }
  return data.name;
}

export type AddCommentRequest = {
  quoteId: string;
  commentData: Record<string, unknown>;
};

export async function addCommentToFirebase(request: AddCommentRequest): Promise<string> {
  const response = await fetch(
    `${FIREBASE_DOMAIN}/comments/${encodeURIComponent(request.quoteId)}.json`,
    {
      method: 'POST',
      body: JSON.stringify(request.commentData),
      headers: { 'Content-Type': 'application/json' },
    },
  );
  const data = (await response.json()) as { name?: string; error?: unknown };

  if (!response.ok) {
    throw new Error(recordErrorMessage(data, 'Could not add comment.'));
  }
  if (!data?.name) {
    throw new Error('Could not add comment.');
  }
  return data.name;
}

export async function fetchCommentsForQuote(quoteId: string): Promise<Comment[]> {
  const response = await fetch(
    `${FIREBASE_DOMAIN}/comments/${encodeURIComponent(quoteId)}.json`,
  );
  const data = (await response.json()) as FirebaseRecord<Record<string, unknown>>;

  if (!response.ok) {
    throw new Error('Could not get comments.');
  }
  if (data == null || typeof data !== 'object') {
    return [];
  }

  const out: Comment[] = [];
  for (const key of Object.keys(data)) {
    const row = data[key];
    if (row == null || typeof row !== 'object') continue;
    out.push({ id: key, ...(row as Record<string, unknown>) });
  }
  return out;
}
