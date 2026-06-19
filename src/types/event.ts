export type EventCategory =
  | 'birthday'
  | 'anniversary'
  | 'exam'
  | 'travel'
  | 'salary'
  | 'deadline'
  | 'custom';

export type RepeatType =
  | 'none'
  | 'yearly'
  | 'monthly'
  | 'weekly'
  | 'custom';

export type DateType = 'solar' | 'lunar';

export interface LunarDate {
  year: number;
  month: number;
  day: number;
  isLeapMonth?: boolean;
  yearGanZhi?: string;
  monthName?: string;
  dayName?: string;
}

export interface ReminderSetting {
  onEventDay: boolean;
  daysBefore: number[];
  customDays?: number;
  browserNotify: boolean;
  popupNotify: boolean;
}

export interface CountdownEvent {
  id: string;
  title: string;
  icon: string;
  categoryId: string;
  dateType: DateType;
  targetDate: string;
  lunarDate?: LunarDate;
  repeatType: RepeatType;
  repeatCustomInterval?: number;
  repeatEndDate?: string;
  reminder: ReminderSetting;
  isPinned: boolean;
  sortOrder: number;
  createdAt: number;
  updatedAt: number;
  nextOccurrence?: string;
  daysRemaining?: number;
  isPast?: boolean;
}
