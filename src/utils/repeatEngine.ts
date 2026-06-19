import {
  addYears as addYearsFns,
  addMonths as addMonthsFns,
  addWeeks as addWeeksFns,
  addDays as addDaysFns,
  parseISO,
  isAfter as isAfterFns,
  isSameMonth as isSameMonthFns,
  getDate,
  lastDayOfMonth,
} from 'date-fns';
import type { RepeatType, DateType, LunarDate } from '../types/event';
import { lunarToSolar, solarToLunar, getLunarMonthDays } from './lunarConverter';

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function toISO(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function addYears(dateStr: string, years: number): string {
  const d = parseISO(dateStr);
  const origDay = getDate(d);
  const result = addYearsFns(d, years);
  const lastDay = getDate(lastDayOfMonth(result));
  if (origDay > lastDay) {
    result.setDate(lastDay);
  }
  return toISO(result);
}

export function addMonths(dateStr: string, months: number): string {
  const d = parseISO(dateStr);
  const origDay = getDate(d);
  const result = addMonthsFns(d, months);
  const lastDay = getDate(lastDayOfMonth(result));
  if (origDay > lastDay) {
    result.setDate(lastDay);
  }
  return toISO(result);
}

export function addWeeks(dateStr: string, weeks: number): string {
  const result = addWeeksFns(parseISO(dateStr), weeks);
  return toISO(result);
}

export function addDays(dateStr: string, days: number): string {
  const result = addDaysFns(parseISO(dateStr), days);
  return toISO(result);
}

export function isSameMonthDay(date1: string, date2: string): boolean {
  const d1 = parseISO(date1);
  const d2 = parseISO(date2);
  return isSameMonthFns(d1, d2) && getDate(d1) === getDate(d2);
}

export function isAfter(date1: string, date2: string): boolean {
  return isAfterFns(parseISO(date1), parseISO(date2));
}

function solarNext(
  target: string,
  repeatType: RepeatType,
  customInterval: number = 1,
  todayISO: string
): string {
  let current = target;
  const maxAttempts = 1000;
  let attempts = 0;

  while (!isAfter(current, todayISO) && attempts < maxAttempts) {
    switch (repeatType) {
      case 'weekly':
        current = addWeeks(current, customInterval);
        break;
      case 'monthly':
        current = addMonths(current, customInterval);
        break;
      case 'yearly':
        current = addYears(current, customInterval);
        break;
      case 'custom':
        current = addDays(current, customInterval);
        break;
      default:
        return current;
    }
    attempts++;
  }

  if (attempts === 0) {
    return current;
  }

  return current;
}

function lunarNext(
  lunarDate: LunarDate,
  repeatType: RepeatType,
  customInterval: number = 1,
  todayISO: string
): string {
  let ly = lunarDate.year;
  let lm = lunarDate.month;
  let ld = lunarDate.day;
  let lLeap = lunarDate.isLeapMonth ?? false;
  const maxAttempts = 1000;
  let attempts = 0;

  let solar = toISO(lunarToSolar(ly, lm, ld, lLeap));

  while (!isAfter(solar, todayISO) && attempts < maxAttempts) {
    switch (repeatType) {
      case 'weekly': {
        const d = lunarToSolar(ly, lm, ld, lLeap);
        d.setDate(d.getDate() + 7 * customInterval);
        const lun = solarToLunar(d);
        ly = lun.year;
        lm = lun.month;
        ld = lun.day;
        lLeap = lun.isLeapMonth ?? false;
        break;
      }
      case 'monthly': {
        let newMonth = lm + customInterval;
        while (newMonth > 12) {
          newMonth -= 12;
          ly += 1;
        }
        lm = newMonth;
        lLeap = false;
        const maxDays = getLunarMonthDays(ly, lm, false);
        if (ld > maxDays) {
          ld = maxDays;
        }
        break;
      }
      case 'yearly': {
        ly += customInterval;
        break;
      }
      case 'custom': {
        const d = lunarToSolar(ly, lm, ld, lLeap);
        d.setDate(d.getDate() + customInterval);
        const lun = solarToLunar(d);
        ly = lun.year;
        lm = lun.month;
        ld = lun.day;
        lLeap = lun.isLeapMonth ?? false;
        break;
      }
      default:
        return solar;
    }
    solar = toISO(lunarToSolar(ly, lm, ld, lLeap));
    attempts++;
  }
  return solar;
}

export function calculateNextOccurrence(
  targetDate: string,
  repeatType: RepeatType,
  repeatCustomInterval?: number,
  repeatEndDate?: string,
  dateType: DateType = 'solar',
  lunarDate?: LunarDate
): string {
  const today = new Date();
  const todayISO = toISO(today);

  let result: string;

  if (repeatType === 'none') {
    result = targetDate;
  } else if (dateType === 'lunar' && lunarDate) {
    result = lunarNext(lunarDate, repeatType, repeatCustomInterval || 1, todayISO);
  } else {
    result = solarNext(targetDate, repeatType, repeatCustomInterval || 1, todayISO);
  }

  if (repeatEndDate && isAfter(result, repeatEndDate)) {
    return targetDate;
  }

  return result;
}
