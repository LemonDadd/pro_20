import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Repeat,
  Bell,
  Settings,
  Info,
  Pin,
  AlertCircle,
  Trash2,
  Globe,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useEventsStore } from '@/store/eventsStore';
import { CATEGORY_PRESETS } from '@/utils/categoryPresets';
import { lunarToSolar, solarToLunar } from '@/utils/lunarConverter';
import { cn } from '@/lib/utils';
import type {
  CountdownEvent,
  DateType,
  LunarDate,
  ReminderSetting,
  RepeatType,
} from '@/types/event';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Toggle from '@/components/common/Toggle';
import DatePicker from './DatePicker';

const EMOJI_PRESETS = [
  '🎂', '💝', '📚', '✈️', '💰', '⏰', '🎄', '🏮', '🎉', '🎓',
  '💍', '🏆', '🎵', '🎨', '🍰', '🏖️', '🎁', '🎯', '💡', '⭐',
];

const REMINDER_DAY_OPTIONS = [
  { label: '事件当天', days: 0 },
  { label: '提前1天', days: 1 },
  { label: '提前3天', days: 3 },
  { label: '提前7天', days: 7 },
  { label: '提前30天', days: 30 },
];

const REPEAT_OPTIONS: { label: string; value: RepeatType }[] = [
  { label: '不重复', value: 'none' },
  { label: '每年', value: 'yearly' },
  { label: '每月', value: 'monthly' },
  { label: '每周', value: 'weekly' },
  { label: '自定义', value: 'custom' },
];

interface FormState {
  title: string;
  icon: string;
  categoryId: string;
  dateType: DateType;
  solarDate: string;
  lunarDate: LunarDate;
  repeatType: RepeatType;
  repeatCustomInterval: number;
  repeatEndDate: string;
  reminder: ReminderSetting;
  isPinned: boolean;
  customDaysInput: string;
}

function getDefaultFormState(): FormState {
  const today = new Date();
  const defaultSolar = today.toISOString().split('T')[0];
  const defaultLunar = solarToLunar(today);

  return {
    title: '',
    icon: '🎂',
    categoryId: 'birthday',
    dateType: 'solar',
    solarDate: defaultSolar,
    lunarDate: defaultLunar,
    repeatType: 'none',
    repeatCustomInterval: 7,
    repeatEndDate: '',
    reminder: {
      onEventDay: true,
      daysBefore: [1, 7],
      customDays: undefined,
      browserNotify: false,
      popupNotify: true,
    },
    isPinned: false,
    customDaysInput: '',
  };
}

interface FormErrors {
  title?: string;
  date?: string;
}

export default function EventModal() {
  const { isEventModalOpen, editingEventId, closeEventModal } = useUIStore();
  const { addEvent, updateEvent, deleteEvent, getEventById } = useEventsStore();

  const [form, setForm] = useState<FormState>(getDefaultFormState());
  const [errors, setErrors] = useState<FormErrors>({});
  const [browserNotifySupported, setBrowserNotifySupported] = useState(true);

  useEffect(() => {
    if (typeof Notification !== 'undefined') {
      setBrowserNotifySupported(true);
    } else {
      setBrowserNotifySupported(false);
    }
  }, []);

  const isEditing = editingEventId != null;

  useEffect(() => {
    if (!isEventModalOpen) return;

    if (isEditing) {
      const event = getEventById(editingEventId);
      if (event) {
        const today = new Date();
        const fallbackLunar = solarToLunar(today);

        setForm({
          title: event.title,
          icon: event.icon,
          categoryId: event.categoryId,
          dateType: event.dateType,
          solarDate: event.targetDate,
          lunarDate: event.lunarDate ?? fallbackLunar,
          repeatType: event.repeatType,
          repeatCustomInterval: event.repeatCustomInterval ?? 7,
          repeatEndDate: event.repeatEndDate ?? '',
          reminder: {
            ...event.reminder,
          },
          isPinned: event.isPinned,
          customDaysInput: event.reminder.customDays?.toString() ?? '',
        });
      }
    } else {
      setForm(getDefaultFormState());
    }
    setErrors({});
  }, [isEventModalOpen, editingEventId, isEditing, getEventById]);

  const updateForm = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateReminder = useCallback(<K extends keyof ReminderSetting>(key: K, value: ReminderSetting[K]) => {
    setForm((prev) => ({
      ...prev,
      reminder: { ...prev.reminder, [key]: value },
    }));
  }, []);

  const handleSolarChange = useCallback((date: string) => {
    updateForm('solarDate', date);
    if (date) {
      const d = new Date(date);
      if (!isNaN(d.getTime())) {
        updateForm('lunarDate', solarToLunar(d));
      }
    }
  }, [updateForm]);

  const handleLunarChange = useCallback((lunar: LunarDate) => {
    updateForm('lunarDate', lunar);
    try {
      const solar = lunarToSolar(lunar.year, lunar.month, lunar.day, lunar.isLeapMonth);
      updateForm('solarDate', solar.toISOString().split('T')[0]);
    } catch {
      // ignore
    }
  }, [updateForm]);

  const handleDateTypeChange = useCallback((type: DateType) => {
    updateForm('dateType', type);
  }, [updateForm]);

  const toggleReminderDay = useCallback((days: number) => {
    if (days === 0) {
      updateReminder('onEventDay', !form.reminder.onEventDay);
    } else {
      setForm((prev) => {
        const has = prev.reminder.daysBefore.includes(days);
        return {
          ...prev,
          reminder: {
            ...prev.reminder,
            daysBefore: has
              ? prev.reminder.daysBefore.filter((d) => d !== days)
              : [...prev.reminder.daysBefore, days],
          },
        };
      });
    }
  }, [form.reminder.onEventDay, updateReminder]);

  const handleCustomDaysAdd = useCallback(() => {
    const val = parseInt(form.customDaysInput, 10);
    if (!isNaN(val) && val > 0 && !form.reminder.daysBefore.includes(val)) {
      setForm((prev) => ({
        ...prev,
        reminder: {
          ...prev.reminder,
          daysBefore: [...prev.reminder.daysBefore, val].sort((a, b) => a - b),
          customDays: val,
        },
        customDaysInput: '',
      }));
    }
  }, [form.customDaysInput, form.reminder.daysBefore]);

  const requestBrowserPermission = useCallback(async () => {
    if (typeof Notification === 'undefined') return;
    if (Notification.permission === 'granted') {
      updateReminder('browserNotify', true);
    } else if (Notification.permission !== 'denied') {
      const result = await Notification.requestPermission();
      updateReminder('browserNotify', result === 'granted');
    }
  }, [updateReminder]);

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!form.title.trim()) {
      newErrors.title = '请输入事件名称';
    }

    if (!form.solarDate) {
      newErrors.date = '请选择日期';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form.title, form.solarDate]);

  const buildEventData = useCallback((): Omit<CountdownEvent, 'id' | 'createdAt' | 'updatedAt'> => {
    return {
      title: form.title.trim(),
      icon: form.icon,
      categoryId: form.categoryId,
      dateType: form.dateType,
      targetDate: form.solarDate,
      lunarDate: form.dateType === 'lunar' ? form.lunarDate : undefined,
      repeatType: form.repeatType,
      repeatCustomInterval: form.repeatType === 'custom' ? form.repeatCustomInterval : undefined,
      repeatEndDate: form.repeatType !== 'none' && form.repeatEndDate ? form.repeatEndDate : undefined,
      reminder: {
        ...form.reminder,
        daysBefore: [...form.reminder.daysBefore].sort((a, b) => a - b),
      },
      isPinned: form.isPinned,
      sortOrder: Date.now(),
    };
  }, [form]);

  const handleSave = useCallback(() => {
    if (!validate()) return;

    const data = buildEventData();

    if (isEditing) {
      updateEvent(editingEventId, data);
    } else {
      addEvent(data);
    }

    closeEventModal();
  }, [validate, buildEventData, isEditing, editingEventId, updateEvent, addEvent, closeEventModal]);

  const handleDelete = useCallback(() => {
    if (editingEventId) {
      deleteEvent(editingEventId);
      closeEventModal();
    }
  }, [editingEventId, deleteEvent, closeEventModal]);

  const handleClose = useCallback(() => {
    closeEventModal();
  }, [closeEventModal]);

  return (
    <Modal
      isOpen={isEventModalOpen}
      onClose={handleClose}
      title={isEditing ? '编辑事件' : '新建事件'}
      maxWidth="lg"
    >
      <div className="max-h-[70vh] overflow-y-auto pr-2 -mr-2 space-y-6 scrollbar-thin">
        {/* 区块1: 基本信息 */}
        <Section title="基本信息" icon={<Info className="w-4 h-4" />}>
          <Input
            label="事件名称"
            placeholder="例如：我的生日"
            required
            value={form.title}
            onChange={(e) => updateForm('title', e.target.value)}
            error={errors.title}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">选择图标</label>
            <div className="grid grid-cols-10 gap-2">
              {EMOJI_PRESETS.map((emoji) => (
                <motion.button
                  key={emoji}
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => updateForm('icon', emoji)}
                  className={cn(
                    'aspect-square flex items-center justify-center rounded-xl text-2xl transition-all duration-200',
                    form.icon === emoji
                      ? 'bg-gradient-primary text-white shadow-soft ring-2 ring-primary-400 ring-offset-2'
                      : 'bg-white/70 border border-gray-200 hover:border-primary-300 hover:bg-white'
                  )}
                >
                  {emoji}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">选择分类</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {CATEGORY_PRESETS.map((cat) => (
                <motion.button
                  key={cat.id}
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    updateForm('categoryId', cat.id);
                    if (!form.title.trim()) {
                      updateForm('icon', cat.icon);
                    }
                  }}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2.5 rounded-2xl transition-all duration-200 text-left',
                    form.categoryId === cat.id
                      ? 'shadow-soft ring-2 ring-offset-2'
                      : 'bg-white/70 border border-gray-200 hover:border-gray-300 hover:bg-white'
                  )}
                  style={
                    form.categoryId === cat.id
                      ? {
                          background: `linear-gradient(135deg, ${cat.gradient[0]} 0%, ${cat.gradient[1]} 100%)`,
                          // @ts-expect-error custom css var
                          '--tw-ring-color': cat.color,
                        }
                      : undefined
                  }
                >
                  <div
                    className="w-9 h-9 shrink-0 rounded-xl flex items-center justify-center text-lg shadow-sm"
                    style={{
                      background: `linear-gradient(135deg, ${cat.gradient[0]} 0%, ${cat.gradient[1]} 100%)`,
                    }}
                  >
                    {cat.icon}
                  </div>
                  <span
                    className={cn(
                      'text-sm font-medium truncate',
                      form.categoryId === cat.id ? 'text-white' : 'text-gray-700'
                    )}
                  >
                    {cat.name}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </Section>

        {/* 区块2: 日期设置 */}
        <Section title="日期设置" icon={<Calendar className="w-4 h-4" />}>
          <DatePicker
            dateType={form.dateType}
            solarDate={form.solarDate}
            lunarDate={form.lunarDate}
            onSolarChange={handleSolarChange}
            onLunarChange={handleLunarChange}
            onDateTypeChange={handleDateTypeChange}
          />
          {errors.date && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.date}
            </p>
          )}
        </Section>

        {/* 区块3: 重复规则 */}
        <Section title="重复规则" icon={<Repeat className="w-4 h-4" />}>
          <div className="relative flex rounded-2xl bg-white/80 p-1 border border-gray-200 overflow-x-auto">
            <div
              className={cn(
                'absolute top-1 bottom-1 rounded-xl bg-gradient-primary shadow-soft transition-all duration-300',
                getRepeatTabPosition(form.repeatType)
              )}
            />
            {REPEAT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => updateForm('repeatType', opt.value)}
                className={cn(
                  'relative z-10 flex-1 min-w-[72px] py-2.5 px-2 rounded-xl text-xs sm:text-sm font-medium transition-colors duration-200 whitespace-nowrap',
                  form.repeatType === opt.value
                    ? 'text-white'
                    : 'text-gray-600 hover:text-gray-800'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {form.repeatType === 'custom' && (
              <motion.div
                key="custom"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <Input
                  label="重复间隔"
                  type="number"
                  min={1}
                  value={form.repeatCustomInterval}
                  onChange={(e) => updateForm('repeatCustomInterval', Math.max(1, parseInt(e.target.value) || 1))}
                  suffix="天"
                  helperText="每隔 N 天重复一次"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {form.repeatType !== 'none' && (
              <motion.div
                key="endDate"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <Input
                  label="结束日期（可选）"
                  type="date"
                  value={form.repeatEndDate}
                  onChange={(e) => updateForm('repeatEndDate', e.target.value)}
                  helperText="留空表示永久重复"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Section>

        {/* 区块4: 提醒设置 */}
        <Section title="提醒设置" icon={<Bell className="w-4 h-4" />}>
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
            {form.reminder.daysBefore.filter((d) => !REMINDER_DAY_OPTIONS.find((o) => o.days === d)).map((d) => (
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
        </Section>

        {/* 区块5: 其他设置 */}
        <Section title="其他设置" icon={<Settings className="w-4 h-4" />}>
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/60 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 flex items-center justify-center">
                <Pin className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-800">置顶显示</div>
                <div className="text-xs text-gray-400 mt-0.5">优先展示在列表顶部</div>
              </div>
            </div>
            <Toggle
              checked={form.isPinned}
              onChange={(v) => updateForm('isPinned', v)}
            />
          </div>
        </Section>
      </div>

      {/* 底部操作栏 */}
      <div className="mt-6 pt-4 border-t border-gray-100/80 flex items-center justify-between gap-3">
        <div>
          {isEditing && (
            <Button
              variant="danger"
              size="md"
              leftIcon={<Trash2 className="w-4 h-4" />}
              onClick={handleDelete}
            >
              删除
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="md" onClick={handleClose}>
            取消
          </Button>
          <Button variant="primary" size="md" onClick={handleSave}>
            {isEditing ? '保存修改' : '创建事件'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 pb-1 border-b border-gray-100/80">
        <div className="w-7 h-7 rounded-lg bg-gradient-primary text-white flex items-center justify-center shadow-soft">
          {icon}
        </div>
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="space-y-4">{children}</div>
    </motion.div>
  );
}

function getRepeatTabPosition(value: RepeatType): React.CSSProperties {
  const idx = REPEAT_OPTIONS.findIndex((o) => o.value === value);
  const pct = (100 / REPEAT_OPTIONS.length).toFixed(2);
  const left = `calc(${idx * parseFloat(pct)}% + 4px)`;
  const width = `calc(${pct}% - 8px)`;
  return { left, width };
}
