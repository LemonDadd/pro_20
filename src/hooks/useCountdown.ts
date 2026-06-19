import { useState, useEffect, useMemo } from 'react';
import type { CountdownEvent } from '../types/event';
import { computeEventMetrics, getDaysLabel, formatDateDisplay } from '../utils/dateCalculator';

interface CountdownResult {
  daysRemaining: number;
  nextOccurrence: string;
  nextOccurrenceDisplay: string;
  isPast: boolean;
  isToday: boolean;
  label: string;
  statusText: string;
}

export function useCountdown(event: CountdownEvent): CountdownResult {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const metrics = useMemo(() => {
    return computeEventMetrics(event);
  }, [event, tick]);

  const daysInfo = getDaysLabel(metrics.daysRemaining);

  return {
    daysRemaining: metrics.daysRemaining,
    nextOccurrence: metrics.nextOccurrence,
    nextOccurrenceDisplay: formatDateDisplay(
      metrics.nextOccurrence,
      event.dateType,
      event.lunarDate
    ),
    isPast: metrics.isPast,
    isToday: daysInfo.isToday,
    label: daysInfo.label,
    statusText: daysInfo.isToday ? '今天' : daysInfo.isFuture ? '还剩' : '已过',
  };
}
