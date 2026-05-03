export type QuoteCategory =
  | 'Islamic'
  | 'Motivation'
  | 'Sad'
  | 'Love'
  | 'Life';

export type Quote = {
  id: string;
  category: QuoteCategory;
  text: string;
};

/** Optional RTDB node for bumping “catalog version” and driving notifications */
export type QuotesMeta = {
  version?: number;
};

export type Comment = {
  id: string;
  text?: string;
  author?: string;
  [key: string]: unknown;
};
