import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useEventsStore } from '@/store/eventsStore';
import { useUIStore } from '@/store/uiStore';
import { computeEventMetrics } from '@/utils/dateCalculator';
import { cn } from '@/lib/utils';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import WidgetCard from './WidgetCard';
import type { CountdownEventWithMetrics } from '../events/EventCard';

export default function WidgetMode() {
  const { activeView, setActiveView } = useUIStore();
  const { events } = useEventsStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    if (activeView !== 'widget') return;
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, [activeView]);

  const processedEvents = useMemo<CountdownEventWithMetrics[]>(() => {
    return events.map((event) => {
      const metrics = computeEventMetrics(event);
      return {
        ...event,
        daysRemaining: metrics.daysRemaining,
        nextOccurrence: metrics.nextOccurrence,
        isPast: metrics.isPast,
      };
    });
  }, [events]);

  const sortedEvents = useMemo(() => {
    return [...processedEvents].sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return a.daysRemaining - b.daysRemaining;
    });
  }, [processedEvents]);

  const goToPrev = () => {
    setCurrentIndex((prev) =>
      prev <= 0 ? sortedEvents.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev >= sortedEvents.length - 1 ? 0 : prev + 1
    );
  };

  const handleClose = () => {
    setActiveView('grid');
  };

  useKeyboardShortcuts({
    ArrowLeft: goToPrev,
    ArrowRight: goToNext,
    Escape: handleClose,
  });

  if (activeView !== 'widget' || sortedEvents.length === 0) return null;

  const currentEvent = sortedEvents[currentIndex];
  const timeStr = format(now, 'HH:mm:ss');
  const dateStr = format(now, 'yyyy年MM月dd日 EEEE', { locale: zhCN });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center blur-3xl scale-110 widget-bg"
        />
        <div className="absolute inset-0 widget-overlay" />
      </div>

      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-10">
        <div>
          <div className="text-6xl font-mono font-bold tracking-tight drop-shadow-lg" style={{ color: 'var(--widget-ctrl-fg)' }}>
            {timeStr}
          </div>
          <div className="text-xl mt-2 drop-shadow" style={{ color: 'color-mix(in srgb, var(--widget-ctrl-fg) 80%, transparent)' }}>
            {dateStr}
          </div>
          <div className="mt-3 text-sm drop-shadow flex items-center gap-1.5" style={{ color: 'color-mix(in srgb, var(--widget-ctrl-fg) 60%, transparent)' }}>
            <kbd className="px-2 py-0.5 rounded text-xs border border-white/20 widget-ctrl">ESC</kbd>
            <span>退出全屏</span>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClose}
          className="w-12 h-12 rounded-full widget-ctrl flex items-center justify-center transition-colors"
        >
          <X className="w-6 h-6" />
        </motion.button>
      </div>

      <div className="w-full h-full flex items-center justify-center px-4 relative">
        {sortedEvents.length > 1 && (
          <motion.button
            whileHover={{ scale: 1.08, x: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToPrev}
            className="absolute left-8 z-10 w-16 h-16 rounded-full widget-ctrl flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-8 h-8" />
          </motion.button>
        )}

        <div className="flex items-center justify-center px-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentEvent.id}
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -40, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            >
              <WidgetCard event={currentEvent} />
            </motion.div>
          </AnimatePresence>
        </div>

        {sortedEvents.length > 1 && (
          <motion.button
            whileHover={{ scale: 1.08, x: 4 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToNext}
            className="absolute right-8 z-10 w-16 h-16 rounded-full widget-ctrl flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-8 h-8" />
          </motion.button>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
        <div className="flex gap-2 justify-center">
          {sortedEvents.map((event, index) => (
            <motion.button
              key={event.id}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                'rounded-full transition-all duration-300 shadow-lg',
                index === currentIndex
                  ? 'w-8 h-3 widget-indicator-active'
                  : 'w-3 h-3 widget-indicator-inactive'
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
