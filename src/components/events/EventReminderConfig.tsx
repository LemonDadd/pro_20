import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Globe, MessageSquare, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FormState } from './EventModal';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Toggle from '@/components/common/Toggle';

const REMINDER_DAY_OPTIONS = [
  { label: '事件当天', days: 0 },
  { label: '提前1天', days: 1 },
  { label: '提前3天', days: 3 },
  { label: '提前7天', days: 7 },
  { label: '提前30天', days: 30 },
];

interface EventReminderConfigProps {
  form: FormState;
  updateForm: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}

export default function EventReminderConfig({ form, updateForm }: EventReminderConfigProps) {
  const [browserNotifySupported, setBrowserNotifySupported] = useState(true);

  useEffect(() => {
    if (typeof Notification !== 'undefined') {
      setBrowserNotifySupported(true);
    } else {
      setBrowserNotifySupported(false);
    }
  }, []);

  const updateReminder = useCallback(<K extends keyof FormState['reminder']>(
    key: K,
    value: FormState['reminder'][K]
  ) => {
    updateForm('reminder', { ...form.reminder, [key]: value });
  }, [form.reminder, updateForm]);

  const toggleReminderDay = useCallback((days: number) => {
    if (days === 0) {
      updateReminder('onEventDay', !form.reminder.onEventDay);
    } else {
      const has = form.reminder.daysBefore.includes(days);
      updateReminder('daysBefore', has
        ? form.reminder.daysBefore.filter((d) => d !== days)
        : [...form.reminder.daysBefore, days]);
    }
  }, [form.reminder.onEventDay, form.reminder.daysBefore, updateReminder]);

  const handleCustomDaysAdd = useCallback(() => {
    const val = parseInt(form.customDaysInput, 10);
    if (!isNaN(val) && val > 0 && !form.reminder.daysBefore.includes(val)) {
      updateForm('reminder', {
        ...form.reminder,
        daysBefore: [...form.reminder.daysBefore, val].sort((a, b) => a - b),
        customDays: val,
      });
      updateForm('customDaysInput', '');
    }
  }, [form.customDaysInput, form.reminder, updateForm]);

  const requestBrowserPermission = useCallback(async () => {
    if (typeof Notification === 'undefined') return;
    if (Notification.permission === 'granted') {
      updateReminder('browserNotify', true);
    } else if (Notification.permission !== 'denied') {
      const result = await Notification.requestPermission();
      updateReminder('browserNotify', result === 'granted');
    }
  }, [updateReminder]);

  const extraDays = form.reminder.daysBefore.filter(
    (d) => !REMINDER_DAY_OPTIONS.find((o) => o.days === d)
  );

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">提醒时机</label>
        <div className="flex flex-wrap gap-2">
          {REMINDER_DAY_OPTIONS.map((opt) => {
            const isActive =
              opt.days === 0 ? form.reminder.onEventDay : form.reminder.daysBefore.includes(opt.days);
            return (
              <motion.button
                key={opt.days}
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => toggleReminderDay(opt.days)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gradient-primary text-white shadow-soft'
                    : 'bg-white/70 text-gray-600 border border-gray-200 hover:border-primary-300'
                )}
              >
                {opt.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-2">
        <Input
          label="自定义天数"
          type="number"
          min={1}
          value={form.customDaysInput}
          onChange={(e) => updateForm('customDaysInput', e.target.value)}
          placeholder="输入 N 天前提醒"
          suffix={
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCustomDaysAdd}
              leftIcon={<Sparkles className="w-4 h-4" />}
              disabled={!form.customDaysInput}
            >
              添加
            </Button>
          }
          className="flex-1 min-w-[200px]"
        />
        {form.reminder.customDays != null && !form.reminder.daysBefore.includes(form.reminder.customDays) && (
          <span className="px-3 py-1.5 rounded-full text-xs bg-primary-50 text-primary-600 border border-primary-100">
            自定义: 提前{form.reminder.customDays}天
          </span>
        )}
        {extraDays.map((d) => (
          <span
            key={d}
            className="px-3 py-1.5 rounded-full text-xs bg-primary-50 text-primary-600 border border-primary-100"
          >
            提前{d}天
          </span>
        ))}
      </div>

      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between p-3 rounded-2xl bg-white/60 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <Globe className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-800">浏览器通知</div>
              {!browserNotifySupported && (
                <div className="text-xs text-gray-400 mt-0.5">当前浏览器不支持</div>
              )}
            </div>
          </div>
          <Toggle
            checked={form.reminder.browserNotify}
            onChange={(v) => {
              if (v) {
                requestBrowserPermission();
              } else {
                updateReminder('browserNotify', false);
              }
            }}
            disabled={!browserNotifySupported}
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-2xl bg-white/60 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-800">弹窗通知</div>
              <div className="text-xs text-gray-400 mt-0.5">应用内弹出提醒</div>
            </div>
          </div>
          <Toggle
            checked={form.reminder.popupNotify}
            onChange={(v) => updateReminder('popupNotify', v)}
          />
        </div>
      </div>
    </div>
  );
}
