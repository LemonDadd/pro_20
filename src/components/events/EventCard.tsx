import { motion } from 'framer-motion';
import {
  Calendar,
  Pencil,
  Pin,
  PinOff,
  Share2,
} from 'lucide-react';
import { useEventsStore } from '@/store/eventsStore';
import { useUIStore } from '@/store/uiStore';
import { getCategoryById } from '@/utils/categoryPresets';
import { formatDateDisplay } from '@/utils/dateCalculator';
import { cn } from '@/lib/utils';
import type { CountdownEvent } from '@/types/event';

export interface CountdownEventWithMetrics extends CountdownEvent {
  daysRemaining: number;
  nextOccurrence: string;
  isPast: boolean;
}

interface EventCardProps {
  event: CountdownEventWithMetrics;
  index?: number;
}

export default function EventCard({ event, index = 0 }: EventCardProps) {
  const { togglePin } = useEventsStore();
  const { openEditModal, openShareModal } = useUIStore();

  const category = getCategoryById(event.categoryId);

  const isToday = event.daysRemaining === 0;
  const isFuture = event.daysRemaining > 0;
  const isPast = event.isPast || event.daysRemaining < 0;

  const statusLabel = isToday ? '今天' : isFuture ? '还剩' : '已过';
  const displayDays = Math.abs(event.daysRemaining);

  const handleCardClick = () => {
    openEditModal(event.id);
  };

  const handlePinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    togglePin(event.id);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openEditModal(event.id);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openShareModal(event.id);
  };

  const gradientStyle = {
    background: `linear-gradient(90deg, ${category.gradient[0]} 0%, ${category.gradient[1]} 100%)`,
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
        delay: index * 0.05,
      }}
      whileHover={{ y: -4 }}
      onClick={handleCardClick}
      className="glass-card relative cursor-pointer overflow-hidden rounded-3xl p-5 shadow-soft transition-all duration-300 hover:shadow-soft-lg"
    >
      <div
        className="absolute left-0 top-0 h-1.5 w-full"
        style={gradientStyle}
      />

      <div className="mb-3 flex items-start justify-between">
        <div className="text-4xl animate-float">{event.icon}</div>
        <button
          onClick={handlePinClick}
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-xl transition-all',
            event.isPinned
              ? 'text-primary-500'
              : 'text-gray-300 hover:text-gray-500'
          )}
        >
          {event.isPinned ? (
            <Pin className="h-4 w-4 fill-current" />
          ) : (
            <PinOff className="h-4 w-4" />
          )}
        </button>
      </div>

      <div>
        <h3 className="mb-1.5 line-clamp-1 text-lg font-semibold text-gray-800">
          {event.title}
        </h3>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <Calendar className="h-3.5 w-3.5" />
          <span>
            {formatDateDisplay(
              event.nextOccurrence,
              event.dateType,
              event.lunarDate
            )}
          </span>
        </div>
      </div>

      <div className="my-4 py-4 text-center">
        <div className="mb-2 text-sm font-medium text-gray-500">
          {statusLabel}
        </div>
        <div className="flex items-end justify-center gap-1">
          <span
            className={cn(
              'font-mono text-6xl font-bold tracking-tight',
              isToday && 'text-gradient-primary animate-pulse-slow',
              isFuture && !isToday && 'text-gray-800',
              isPast && 'text-gray-400'
            )}
          >
            {displayDays}
          </span>
          <span className="pb-2 text-2xl font-medium text-gray-500">天</span>
        </div>
      </div>

      <div className="flex gap-2 border-t border-gray-100/60 pt-3">
        <button
          onClick={handleEditClick}
          className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl bg-gray-50 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800"
        >
          <Pencil className="h-4 w-4" />
          <span>编辑</span>
        </button>
        <button
          onClick={handleShareClick}
          className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl bg-gray-50 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800"
        >
          <Share2 className="h-4 w-4" />
          <span>分享</span>
        </button>
        <button
          onClick={handlePinClick}
          className={cn(
            'flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl text-sm transition-colors',
            event.isPinned
              ? 'bg-primary-50 text-primary-600 hover:bg-primary-100'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800'
          )}
        >
          <Pin className={cn('h-4 w-4', event.isPinned && 'fill-current')} />
          <span>{event.isPinned ? '已置顶' : '置顶'}</span>
        </button>
      </div>
    </motion.div>
  );
}
