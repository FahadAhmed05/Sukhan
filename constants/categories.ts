import type { QuoteCategory } from '@/types/quote';

export const CATEGORY_ORDER: QuoteCategory[] = [
  'Islamic',
  'Motivation',
  'Sad',
  'Love',
  'Life',
];

export const CATEGORY_SLUGS: Record<QuoteCategory, string> = {
  Islamic: 'islamic',
  Motivation: 'motivation',
  Sad: 'sad',
  Love: 'love',
  Life: 'life',
};

export const SLUG_TO_CATEGORY: Record<string, QuoteCategory> = {
  islamic: 'Islamic',
  motivation: 'Motivation',
  sad: 'Sad',
  love: 'Love',
  life: 'Life',
};
