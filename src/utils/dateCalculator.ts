import { format, differenceInDays, parseISO, startOfDay } from 'date-fns';
import type { CountdownEvent, DateType, LunarDate, RepeatType } from '../types/event';
import { calculateNextOccurrence, isAfter, addYears, addMonths, addWeeks, addDays } from './repeatEngine';
import { solarToLunar, getLunarDateDisplay } from './lunarConverter';

export function formatDateDisplay(
  dateStr: string,
  dateType: DateType,
  _lunarDate?: LunarDate
): string {
  if (dateType === 'lunar') {
    try {
      const actualLunar = solarToLunar(parseISO(dateStr));
      if (actualLunar) return getLunarDateDisplay(actualLunar);
    } catch {
      // fall through to solar display
    }
  }
  const d = parseISO(dateStr);
  return format(d, 'yyyy年MM月dd日');
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

  const daysRemaining = differenceInDays(parseISO(nextOccurrence), parseISO(todayISO));

  const isPast = event.repeatType === 'none' && isAfter(todayISO, nextOccurrence);

  return {
    nextOccurrence,
    daysRemaining,
    isPast
  };
}

export {
  addYears,
  addMonths,
  addWeeks,
  addDays
};
