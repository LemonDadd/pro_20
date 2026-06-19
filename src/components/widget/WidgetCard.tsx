import { motion } from 'framer-motion';
import { Bell, Calendar, RefreshCw, Pencil, Pin, PinOff, Share2, Trash2 } from 'lucide-react';
import { useEventsStore } from '@/store/eventsStore';
import { useUIStore } from '@/store/uiStore';
import { getCategoryById } from '@/utils/categoryPresets';
import { formatDateDisplay } from '@/utils/dateCalculator';
import { computeEventStatus } from '@/utils/eventStatus';
import { cn } from '@/lib/utils';
import type { CountdownEventWithMetrics } from '@/components/events/EventCard';

interface WidgetCardProps {
  event: CountdownEventWithMetrics;
}

export default function WidgetCard({ event }: WidgetCardProps) {
  const { togglePin, deleteEvent } = useEventsStore();
  const { openEditModal, openShareModal } = useUIStore();
  const category = getCategoryById(event.categoryId);

  const {
    isToday,
    isFuture,
    isPast,
    statusLabel,
    displayDays,
    years,
    remainingDays,
    showYears,
  } = computeEventStatus(event.daysRemaining, event.isPast);

  const hasRepeat = event.repeatType !== 'none';
  const hasReminder = event.reminder.onEventDay || event.reminder.daysBefore.length > 0;

  const glowStyle = {
    boxShadow: `0 0 80px ${category.color}40, 0 0 120px ${category.color}20`,
  };

  const borderGradient = {
    background: `linear-gradient(135deg, ${category.gradient[0]} 0%, ${category.gradient[1]} 100%)`,
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    openEditModal(event.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    openShareModal(event.id);
  };

  const handlePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    togglePin(event.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`确定要删除「${event.title}」吗？`)) {
      deleteEvent(event.id);
    }
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
            <div className="flex items-start gap-5">
              <div className="text-[7rem] leading-none animate-float">{event.icon}</div>
              <div className="flex flex-col gap-2">
                <div
                  className="px-4 py-1.5 rounded-full text-sm font-medium"
                  style={{
                    background: `linear-gradient(135deg, ${category.gradient[0]}20 0%, ${category.gradient[1]}20 100%)`,
                    color: category.color,
                  }}
                >
                  {category.name}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleEdit}
                    className={cn(
                      'h-9 w-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800'
                    )}
                    title="编辑"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleShare}
                    className="h-9 w-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800"
                    title="分享"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handlePin}
                    className={cn(
                      'h-9 w-9 rounded-xl flex items-center justify-center transition-colors',
                      event.isPinned
                        ? 'bg-primary-50 text-primary-600 hover:bg-primary-100'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    )}
                    title={event.isPinned ? '取消置顶' : '置顶'}
                  >
                    {event.isPinned ? (
                      <Pin className="w-4 h-4 fill-current" />
                    ) : (
                      <PinOff className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={handleDelete}
                    className="h-9 w-9 rounded-xl bg-red-50 flex items-center justify-center text-red-500 transition-colors hover:bg-red-100 hover:text-red-700"
                    title="删除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
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
