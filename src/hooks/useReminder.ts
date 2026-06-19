import { useState, useEffect, useCallback, useRef } from 'react';
import type { CountdownEvent } from '../types/event';
import { computeEventMetrics } from '../utils/dateCalculator';

export interface NotificationItem {
  id: string;
  eventId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
}

interface ReminderResult {
  checkReminders: () => void;
  notifications: NotificationItem[];
  dismissNotification: (id: string) => void;
  requestPermission: () => Promise<NotificationPermission>;
}

export function useReminder(events: CountdownEvent[]): ReminderResult {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const triggeredRef = useRef<Set<string>>(new Set());

  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (typeof Notification === 'undefined') {
      return 'denied';
    }
    if (Notification.permission === 'granted' || Notification.permission === 'denied') {
      return Notification.permission;
    }
    try {
      return await Notification.requestPermission();
    } catch {
      return 'denied';
    }
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const showSystemNotification = useCallback((title: string, body: string) => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.svg',
        });
      } catch {
        // ignore
      }
    }
  }, []);

  const checkReminders = useCallback(() => {
    const now = Date.now();
    const newNotifications: NotificationItem[] = [];

    for (const event of events) {
      const metrics = computeEventMetrics(event);
      const { daysRemaining } = metrics;
      const reminder = event.reminder;

      if (!reminder) continue;

      if (reminder.onEventDay && daysRemaining === 0) {
        const key = `${event.id}-today-${now}`;
        if (!triggeredRef.current.has(`${event.id}-today`)) {
          const title = `🎉 ${event.title} 就在今天！`;
          const message = `快去庆祝和记录这个重要的日子吧`;
          newNotifications.push({
            id: key,
            eventId: event.id,
            title,
            message,
            type: 'success',
            timestamp: now,
          });
          if (reminder.browserNotify) {
            showSystemNotification(title, message);
          }
          triggeredRef.current.add(`${event.id}-today`);
        }
      }

      for (const db of reminder.daysBefore ?? []) {
        const triggerKey = `${event.id}-daysbefore-${db}`;
        if (daysRemaining === db && !triggeredRef.current.has(triggerKey)) {
          const title = `⏰ ${event.title} 提醒`;
          const message = `距离 ${event.title} 还有 ${db} 天`;
          const type: NotificationItem['type'] = db <= 1 ? 'warning' : 'info';
          newNotifications.push({
            id: `${triggerKey}-${now}`,
            eventId: event.id,
            title,
            message,
            type,
            timestamp: now,
          });
          if (reminder.browserNotify) {
            showSystemNotification(title, message);
          }
          triggeredRef.current.add(triggerKey);
        }
      }

      if (reminder.customDays) {
        const triggerKey = `${event.id}-custom-${reminder.customDays}`;
        if (daysRemaining === reminder.customDays && !triggeredRef.current.has(triggerKey)) {
          const title = `⏰ ${event.title} 提醒`;
          const message = `距离 ${event.title} 还有 ${reminder.customDays} 天`;
          newNotifications.push({
            id: `${triggerKey}-${now}`,
            eventId: event.id,
            title,
            message,
            type: 'info',
            timestamp: now,
          });
          if (reminder.browserNotify) {
            showSystemNotification(title, message);
          }
          triggeredRef.current.add(triggerKey);
        }
      }
    }

    if (newNotifications.length > 0) {
      setNotifications((prev) => [...newNotifications, ...prev].slice(0, 20));
    }
  }, [events, showSystemNotification]);

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  useEffect(() => {
    if (events.length === 0) return;
    const timer = setTimeout(checkReminders, 1500);
    const interval = setInterval(checkReminders, 60000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [events, checkReminders]);

  return {
    checkReminders,
    notifications,
    dismissNotification,
    requestPermission,
  };
}
