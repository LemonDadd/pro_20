import { useEffect, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import CategoryFilter from '@/components/layout/CategoryFilter';
import StatsPanel from '@/components/layout/StatsPanel';
import EventGrid from '@/components/events/EventGrid';
import EventModal from '@/components/events/EventModal';
import WidgetMode from '@/components/widget/WidgetMode';
import ShareModal from '@/components/share/ShareModal';
import { ToastContainer } from '@/components/common/NotificationToast';
import { useEventsStore } from '@/store/eventsStore';
import { useUIStore } from '@/store/uiStore';
import { useThemeStore } from '@/store/themeStore';
import { sampleEvents } from '@/mock/sampleEvents';
import { useReminder } from '@/hooks/useReminder';
import { cn } from '@/lib/utils';

export default function Home() {
  const { events, hydrateFromMock, hydrated } = useEventsStore();
  const { activeView, isEventModalOpen, isShareModalOpen } = useUIStore();
  const { mode } = useThemeStore();
  const { notifications: rawNotifications, dismissNotification } = useReminder(events);

  const toasts = useMemo(() => {
    return rawNotifications.map((n) => ({
      id: n.id,
      title: n.title,
      message: n.message,
      type: n.type,
      onClose: dismissNotification,
    }));
  }, [rawNotifications, dismissNotification]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hydrated) {
        hydrateFromMock(sampleEvents);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [hydrateFromMock, hydrated]);

  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [mode]);

  const bgClass = useMemo(() => {
    return cn(
      'min-h-screen transition-colors duration-500',
      mode === 'dark'
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
        : 'bg-gradient-warm'
    );
  }, [mode]);

  return (
    <div className={bgClass}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary-300/20 blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/3 -left-40 w-[28rem] h-[28rem] rounded-full bg-amber-300/15 blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-40 right-1/4 w-80 h-80 rounded-full bg-rose-300/20 blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10">
        <Header />

        <main className="container max-w-[1600px] px-4 sm:px-6 py-6">
          <div className="space-y-6 animate-fade-in">
            <StatsPanel />
            <CategoryFilter />
            <EventGrid />
          </div>
        </main>

        <footer className="relative z-10 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>时光倒数 · 记录每一个重要时刻 ✨</p>
        </footer>
      </div>

      <AnimatePresence>
        {activeView === 'widget' && <WidgetMode key="widget-mode" />}
      </AnimatePresence>

      <AnimatePresence>
        {isEventModalOpen && <EventModal key="event-modal" />}
      </AnimatePresence>

      <AnimatePresence>
        {isShareModalOpen && <ShareModal key="share-modal" />}
      </AnimatePresence>

      <ToastContainer toasts={toasts} onDismiss={dismissNotification} />
    </div>
  );
}
