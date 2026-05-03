import { dayKey } from '@/lib/date';

export function lastNDayKeys(n: number): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() - i);
    out.push(dayKey(d));
  }
  return out;
}

export function shortLabel(isoDay: string): string {
  const [, m, day] = isoDay.split('-');
  return `${m}/${day}`;
}
