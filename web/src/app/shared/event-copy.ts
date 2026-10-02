import { CalendarEvent } from '../core/api.service';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function monthKey(eventDate: string) {
  return eventDate.slice(0, 7);
}

export function monthLabel(key: string) {
  const [year, month] = key.split('-');
  return `${MONTHS[Number(month) - 1]} ${year}`;
}

export function thisMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function letterLede(label: string, rows: CalendarEvent[]) {
  if (!rows.length) return `${label} has not been released yet.`;
  const titles = rows.map((row) => row.title).join('; ');
  const noun = rows.length === 1 ? 'date' : 'dates';
  return `${rows.length} public ${noun} in ${label}: ${titles}.`;
}

export function excerpt(notes?: string) {
  const text = (notes ?? '').trim();
  if (text.length <= 140) return text;
  return `${text.slice(0, 137)}…`;
}

export function safeHttp(url?: string) {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') return parsed.toString();
  } catch {
    return '';
  }
  return '';
}

export function mailto(email?: string) {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return '';
  return `mailto:${email}`;
}
