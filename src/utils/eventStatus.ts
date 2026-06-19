export interface EventStatus {
  isToday: boolean;
  isFuture: boolean;
  isPast: boolean;
  statusLabel: string;
  displayDays: number;
  years: number;
  remainingDays: number;
  showYears: boolean;
}

export function computeEventStatus(
  daysRemaining: number,
  isPastFromMetrics: boolean = false
): EventStatus {
  const isToday = daysRemaining === 0;
  const isFuture = daysRemaining > 0;
  const isPast = isPastFromMetrics || daysRemaining < 0;

  const statusLabel = isToday ? '今天' : isFuture ? '还剩' : '已过';
  const displayDays = Math.abs(daysRemaining);

  const years = Math.floor(displayDays / 365);
  const remainingDays = displayDays % 365;
  const showYears = displayDays > 365;

  return {
    isToday,
    isFuture,
    isPast,
    statusLabel,
    displayDays,
    years,
    remainingDays,
    showYears,
  };
}
