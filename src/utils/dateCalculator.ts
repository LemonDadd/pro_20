import { format, differenceInDays, parseISO, startOfDay } from 'date-fns';
import type { CountdownEvent, DateType, LunarDate, RepeatType } from '../types/event';
import { calculateNextOccurrence, isAfter, addYears, addMonths, addWeeks, addDays } from './repeatEngine';
import { getLunarDateDisplay } from './lunarConverter';

export function getTodayISO(): string {
  return format(startOfDay(new Date()), 'yyyy-MM-dd');
}

export function getDaysBetween(dateStr1: string, dateStr2: string): number {
  return differenceInDays(parseISO(dateStr2), parseISO(dateStr1));
}

export function formatDateDisplay(
  dateStr: string,
  dateType: DateType,
  lunarDate?: LunarDate
): string {
  if (dateType === 'lunar' && lunarDate) {
    return getLunarDateDisplay(lunarDate);
  }
  const d = parseISO(dateStr);
  return format(d, 'yyyy年MM月dd日');
}

export function getDaysLabel(daysRemaining: number): {
  label: string;
  isToday: boolean;
  isFuture: boolean;
} {
  if (daysRemaining === 0) {
    return { label: '今天', isToday: true, isFuture: false };
  }
  if (daysRemaining > 0) {
    return { label: `还有${daysRemaining}天`, isToday: false, isFuture: true };
  }
  return { label: `已过${Math.abs(daysRemaining)}天`, isToday: false, isFuture: false };
}

export function computeEventMetrics(
  event: CountdownEvent,
  today: Date = new Date()
): {
  nextOccurrence: string;
  daysRemaining: number;
  isPast: boolean;
} {
  const todayISO = format(startOfDay(today), 'yyyy-MM-dd');
  const eventDate = event.targetDate || todayISO;

  const nextOccurrence = calculateNextOccurrence(
    eventDate,
    event.repeatType,
    event.repeatCustomInterval,
    event.repeatEndDate,
    event.dateType,
    event.lunarDate
  );

  const daysRemaining = getDaysBetween(todayISO, nextOccurrence);

  const isPast = event.repeatType === 'none' && isAfter(todayISO, nextOccurrence);

  return {
    nextOccurrence,
    daysRemaining,
    isPast
  };
}

export function calculateDaysRemaining(targetDateStr: string): number {
  const todayISO = getTodayISO();
  return getDaysBetween(todayISO, targetDateStr);
}

export {
  addYears,
  addMonths,
  addWeeks,
  addDays
};
