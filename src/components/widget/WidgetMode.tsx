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
          className="absolute inset-0 bg-cover bg-center blur-3xl scale-110"
          style={{
            backgroundImage:
              'linear-gradient(135deg, #FFFBF5 0%, #FFF0E6 50%, #FFE5D4 100%)',
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-10">
        <div className="text-white">
          <div className="text-6xl font-mono font-bold tracking-tight drop-shadow-lg">
            {timeStr}
          </div>
          <div className="text-xl text-white/80 mt-2 drop-shadow">
            {dateStr}
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClose}
          className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
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
            className="absolute left-8 z-10 w-16 h-16 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
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
            className="absolute right-8 z-10 w-16 h-16 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
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
                'rounded-full transition-all duration-300',
                index === currentIndex
                  ? 'w-8 h-3 bg-white shadow-lg'
                  : 'w-3 h-3 bg-white/40 hover:bg-white/60'
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
