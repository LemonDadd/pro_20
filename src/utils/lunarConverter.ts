import type { LunarDate } from '../types/event';

const lunarInfo: number[] = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0,
  0x0aea6, 0x0ab50, 0x04b60, 0x04b60, 0x0a571, 0x0a2e0, 0x0d273, 0x029e5, 0x092b0, 0x1a974,
  0x068b0, 0x06ca0, 0x1b554, 0x053b0, 0x04bb0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, 0x17965,
  0x0e4d0, 0x0d260, 0x1eb50, 0x16096, 0x095b0, 0x04bb0, 0x0aab7, 0x052b0, 0x068b0, 0x050e4,
  0x064b0, 0x0dae0, 0x0d463, 0x056a0, 0x055e0, 0x0a3d4, 0x0a2e0, 0x0d2e0, 0x0e9d5, 0x0a960,
  0x04970, 0x064b0, 0x04ab5, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, 0x05aa0, 0x076a3,
  0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x0d0b6, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0,
  0x195a6, 0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46,
  0x0ab60, 0x09570, 0x04af5, 0x04970, 0x064b0, 0x068a6, 0x0d4a0, 0x0ea50, 0x06b55,
  0x05ac0, 0x0ab60, 0x096d4, 0x092e0, 0x0c960, 0x0d954, 0x0d4a0, 0x0d550, 0x0b595,
  0x056a0, 0x0a6e0, 0x0aed3, 0x092e0, 0x0c968, 0x0c950, 0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0,
  0x1a5c4, 0x025d0, 0x092d0, 0x0da2, 0x0a950, 0x0b557, 0x06ca0, 0x0b550, 0x15355,
  0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a5b6, 0x0e4d0, 0x06aa0, 0x0aea6, 0x0ab50,
  0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, 0x0a6d0,
  0x055b4, 0x025d0, 0x092d0, 0x0a9b8, 0x06ca0, 0x06d40, 0x1af45, 0x0ab60, 0x09570,
  0x04970, 0x068b6, 0x0ece0, 0x0d27c, 0x0d520, 0x0daa0, 0x16a65, 0x09300, 0x04970,
  0x064b0, 0x0d4a4, 0x0ea60, 0x0d550, 0x0b456, 0x0cf30, 0x0c8e0, 0x1a958, 0x093b0, 0x14970
];

const Gan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const Zhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const Animals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

const lunarMonthNames = [
  '正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'
];

const lunarDayNames = [
  '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
];

function lYearDays(y: number): number {
  let sum = 348;
  for (let i = 0x8000; i > 0x8; i >>= 1) {
    sum += (lunarInfo[y - 1900] & i) ? 1 : 0;
  }
  return sum + leapDays(y);
}

function leapMonth(y: number): number {
  return lunarInfo[y - 1900] & 0xf;
}

function leapDays(y: number): number {
  if (leapMonth(y)) {
    return (lunarInfo[y - 1900] & 0x10000) ? 30 : 29;
  }
  return 0;
}

function monthDays(y: number, m: number): number {
  return (lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29;
}

export function getLunarMonthDays(lunarYear: number, lunarMonth: number, isLeapMonth: boolean = false): number {
  if (isLeapMonth && leapMonth(lunarYear) === lunarMonth) {
    return leapDays(lunarYear);
  }
  return monthDays(lunarYear, lunarMonth);
}

export function isLeapMonth(lunarYear: number, lunarMonth: number): boolean {
  return leapMonth(lunarYear) === lunarMonth;
}

function ganZhi(year: number): string {
  return Gan[(year - 4) % 10] + Zhi[(year - 4) % 12];
}

function monthName(m: number, isLeap: boolean): string {
  return (isLeap ? '闰' : '') + lunarMonthNames[m - 1] + '月';
}

function dayName(d: number): string {
  return lunarDayNames[d - 1];
}

export function solarToLunar(date: Date): LunarDate {
  const baseDate = new Date(1900, 0, 31);
  const diff = date.getTime() - baseDate.getTime();
  let offset = Math.floor(diff / 86400000);

  let y = 1900;
  let temp = 0;
  for (; y < 2101 && offset > 0; y++) {
    temp = lYearDays(y);
    offset -= temp;
  }
  if (offset < 0) {
    offset += temp;
    y--;
  }

  const year = y;

  const leap = leapMonth(year);
  let isLeap = false;
  let m = 1;
  for (; m < 13 && offset > 0; m++) {
    if (leap > 0 && m === leap + 1 && !isLeap) {
      --m;
      isLeap = true;
      temp = leapDays(year);
    } else {
      temp = monthDays(year, m);
    }

    if (isLeap && m === leap + 1) isLeap = false;
    offset -= temp;
  }

  if (offset === 0 && leap > 0 && m === leap + 1) {
    if (isLeap) {
      isLeap = false;
    } else {
      isLeap = true;
      --m;
    }
  }

  if (offset < 0) {
    offset += temp;
    --m;
  }

  const month = m;
  const day = offset + 1;

  return {
    year,
    month,
    day,
    isLeapMonth: isLeap,
    yearGanZhi: ganZhi(year),
    monthName: monthName(month, isLeap),
    dayName: dayName(day)
  };
}

export function lunarToSolar(
  lunarYear: number,
  lunarMonth: number,
  lunarDay: number,
  isLeapMonth: boolean = false
): Date {
  let offset = 0;
  for (let y = 1900; y < lunarYear; y++) {
    offset += lYearDays(y);
  }

  const leap = leapMonth(lunarYear);
  for (let m = 1; m < lunarMonth; m++) {
    if (leap > 0 && m === leap + 1 && !isLeapMonth) {
      offset += leapDays(lunarYear);
    }
    offset += monthDays(lunarYear, m);
  }

  if (isLeapMonth && leap === lunarMonth) {
    offset += monthDays(lunarYear, lunarMonth);
  }

  offset += lunarDay - 1;

  const baseDate = new Date(1900, 0, 31);
  return new Date(baseDate.getTime() + offset * 86400000);
}

export function getLunarDateDisplay(lunar: LunarDate): string {
  const gz = lunar.yearGanZhi || ganZhi(lunar.year);
  const mn = lunar.monthName || monthName(lunar.month, lunar.isLeapMonth);
  const dn = lunar.dayName || dayName(lunar.day);
  return `${gz}年${mn}${dn}`;
}
