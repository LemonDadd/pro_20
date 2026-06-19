import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  addDays,
  differenceInDays,
  isThisMonth,
  parseISO,
} from 'date-fns';
import { useEventsStore } from '@/store/eventsStore';
import { computeEventMetrics } from '@/utils/dateCalculator';
import type { CountdownEvent } from '@/types/event';

interface StatItem {
  icon: string;
  title: string;
  value: number;
  trend: string;
}

export default function StatsPanel() {
  const { events } = useEventsStore();

  const stats = useMemo<StatItem[]>(() => {
    const today = new Date();
    const todayISO = parseISO(
      new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString().slice(0, 10)
    );
    const sevenDaysLater = addDays(todayISO, 7);

    let monthCount = 0;
    let upcomingCount = 0;
    let pastCount = 0;

    events.forEach((event: CountdownEvent) => {
      const metrics = computeEventMetrics(event, today);
      const nextDate = parseISO(metrics.nextOccurrence);

      if (isThisMonth(nextDate)) {
        monthCount++;
      }

      const daysDiff = differenceInDays(nextDate, todayISO);
      if (daysDiff >= 0 && differenceInDays(nextDate, sevenDaysLater) <= 0) {
        upcomingCount++;
      }

      if (metrics.daysRemaining < 0) {
        pastCount++;
      }
    });

    return [
      {
        icon: '📅',
        title: '本月重要事件',
        value: monthCount,
        trend: monthCount > 0 ? '期待精彩时刻' : '本月暂无安排',
      },
      {
        icon: '⏳',
        title: '即将到来',
        value: upcomingCount,
        trend: upcomingCount > 0 ? '7天内不见不散' : '近期暂无安排',
      },
      {
        icon: '💝',
        title: '已过纪念日',
        value: pastCount,
        trend: pastCount > 0 ? '美好回忆永存' : '一切都是新开始',
      },
    ];
  }, [events]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      className="container grid grid-cols-1 gap-4 py-4 md:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          className="glass-card rounded-3xl p-5 shadow-soft"
        >
          <div className="mb-4 flex items-start justify-between">
            <div>
              <div className="mb-1 text-3xl">{stat.icon}</div>
              <div className="text-sm text-gray-500">{stat.title}</div>
            </div>
          </div>
          <div className="font-mono text-4xl font-bold text-gradient-primary">
            {stat.value}
          </div>
          <div className="mt-2 text-sm text-gray-400">{stat.trend}</div>
        </motion.div>
      ))}
    </motion.div>
  );
}
