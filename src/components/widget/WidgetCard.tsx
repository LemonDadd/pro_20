import { motion } from 'framer-motion';
import { Bell, Calendar, RefreshCw } from 'lucide-react';
import { getCategoryById } from '@/utils/categoryPresets';
import { formatDateDisplay } from '@/utils/dateCalculator';
import { cn } from '@/lib/utils';
import type { CountdownEventWithMetrics } from '../events/EventCard';

interface WidgetCardProps {
  event: CountdownEventWithMetrics;
}

export default function WidgetCard({ event }: WidgetCardProps) {
  const category = getCategoryById(event.categoryId);

  const isToday = event.daysRemaining === 0;
  const isFuture = event.daysRemaining > 0;
  const isPast = event.isPast || event.daysRemaining < 0;

  const statusLabel = isToday ? '今天' : isFuture ? '还剩' : '已过';
  const displayDays = Math.abs(event.daysRemaining);

  const years = Math.floor(displayDays / 365);
  const remainingDays = displayDays % 365;
  const showYears = displayDays > 365;

  const hasRepeat = event.repeatType !== 'none';
  const hasReminder = event.reminder.onEventDay || event.reminder.daysBefore.length > 0;

  const glowStyle = {
    boxShadow: `0 0 80px ${category.color}40, 0 0 120px ${category.color}20`,
  };

  const borderGradient = {
    background: `linear-gradient(135deg, ${category.gradient[0]} 0%, ${category.gradient[1]} 100%)`,
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className="relative max-w-[700px] w-full aspect-[4/5] max-h-[80vh]"
      style={glowStyle}
    >
      <div
        className="absolute inset-0 rounded-[40px] p-[2px]"
        style={borderGradient}
      >
        <div className="w-full h-full rounded-[40px] glass-card p-10 flex flex-col">
          <div className="flex items-start justify-between mb-8">
            <div className="text-[7rem] leading-none animate-float">{event.icon}</div>
            <div
              className="px-4 py-1.5 rounded-full text-sm font-medium"
              style={{
                background: `linear-gradient(135deg, ${category.gradient[0]}20 0%, ${category.gradient[1]}20 100%)`,
                color: category.color,
              }}
            >
              {category.name}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-4xl font-display font-bold text-gray-800 mb-3 leading-tight">
              {event.title}
            </h2>
            <div className="flex items-center gap-2 text-lg text-gray-500">
              <Calendar className="w-5 h-5" />
              <span>
                {formatDateDisplay(
                  event.nextOccurrence,
                  event.dateType,
                  event.lunarDate
                )}
              </span>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="text-xl font-medium text-gray-500 mb-4">
              {statusLabel}
            </div>

            {isToday ? (
              <div className="flex flex-col items-center">
                <span className="font-mono font-black text-[9rem] leading-none text-gradient-primary animate-pulse">
                  0
                </span>
                <div className="text-2xl font-medium text-gradient-primary animate-pulse mt-2">
                  就是今天！
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-baseline justify-center">
                  <span
                    className={cn(
                      'font-mono font-black text-[9rem] leading-none',
                      isFuture && 'text-gradient-primary',
                      isPast && 'text-gray-400'
                    )}
                  >
                    {displayDays}
                  </span>
                  <span className="text-4xl text-gray-500 ml-4 font-medium">
                    天
                  </span>
                </div>
                {showYears && (
                  <div className="mt-4 text-lg text-gray-500">
                    约 {years} 年 {remainingDays} 天
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex items-center justify-center gap-6 pt-6 border-t border-gray-100/60 text-gray-400">
            {hasRepeat && (
              <div className="flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm">
                  {event.repeatType === 'yearly' && '每年重复'}
                  {event.repeatType === 'monthly' && '每月重复'}
                  {event.repeatType === 'weekly' && '每周重复'}
                  {event.repeatType === 'custom' && '自定义重复'}
                </span>
              </div>
            )}
            {hasReminder && (
              <div className="flex items-center gap-1.5">
                <Bell className="w-4 h-4" />
                <span className="text-sm">已开启提醒</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
