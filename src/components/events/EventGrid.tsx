import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarPlus } from 'lucide-react';
import { useEventsStore } from '@/store/eventsStore';
import { useUIStore } from '@/store/uiStore';
import { computeEventMetrics } from '@/utils/dateCalculator';
import EventCard, { type CountdownEventWithMetrics } from './EventCard';

export default function EventGrid() {
  const { events } = useEventsStore();
  const { activeCategoryId, sortBy, searchQuery, openCreateModal } = useUIStore();

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

  const filteredAndSortedEvents = useMemo(() => {
    let result = [...processedEvents];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((event) =>
        event.title.toLowerCase().includes(query)
      );
    }

    if (activeCategoryId !== 'all') {
      result = result.filter((event) => event.categoryId === activeCategoryId);
    }

    result.sort((a, b) => {
      if (a.isPinned !== b.isPinned) {
        return a.isPinned ? -1 : 1;
      }

      switch (sortBy) {
        case 'date':
          return a.daysRemaining - b.daysRemaining;
        case 'created':
          return b.createdAt - a.createdAt;
        case 'pinned':
          return a.sortOrder - b.sortOrder;
        default:
          return 0;
      }
    });

    return result;
  }, [processedEvents, searchQuery, activeCategoryId, sortBy]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  if (filteredAndSortedEvents.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container flex flex-col items-center justify-center py-20"
      >
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-primary/10">
          <CalendarPlus className="h-12 w-12 text-primary-400" />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-gray-700">
          {searchQuery || activeCategoryId !== 'all'
            ? '没有找到匹配的事件'
            : '还没有任何事件'}
        </h3>
        <p className="mb-6 text-center text-gray-500">
          {searchQuery || activeCategoryId !== 'all'
            ? '试试换个搜索词或清除筛选条件'
            : '点击下方按钮，创建你的第一个倒数事件'}
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-2xl bg-gradient-primary px-6 py-3 font-medium text-white shadow-soft transition-all hover:shadow-soft-lg"
        >
          <CalendarPlus className="h-5 w-5" />
          <span>新建事件</span>
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="container pb-8">
      <motion.div
        className="grid grid-cols-1 gap-5 p-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="popLayout">
          {filteredAndSortedEvents.map((event, index) => (
            <EventCard key={event.id} event={event} index={index} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
