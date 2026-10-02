export interface DayCell {
  date: Date;
  inMonth: boolean;
  key: string;
}

export function toKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  next.setDate(next.getDate() + days);
  return next;
}

export function startOfWeek(date: Date): Date {
  return addDays(date, -date.getDay());
}

export function monthCells(anchor: Date): DayCell[] {
  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const start = startOfWeek(first);
  return Array.from({ length: 42 }, (_, index) => cell(addDays(start, index), anchor.getMonth()));
}

export function weekCells(anchor: Date): DayCell[] {
  const start = startOfWeek(anchor);
  return Array.from({ length: 7 }, (_, index) => cell(addDays(start, index), anchor.getMonth()));
}

export function dayCell(anchor: Date): DayCell {
  const date = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate());
  return cell(date, date.getMonth());
}

function cell(date: Date, month: number): DayCell {
  return { date, inMonth: date.getMonth() === month, key: toKey(date) };
}
