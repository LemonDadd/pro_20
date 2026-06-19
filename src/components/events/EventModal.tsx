import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Repeat,
  Bell,
  Settings,
  Info,
  Pin,
  Trash2,
} from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useEventsStore } from '@/store/eventsStore';
import { solarToLunar } from '@/utils/lunarConverter';
import type {
  CountdownEvent,
  DateType,
  LunarDate,
  ReminderSetting,
  RepeatType,
} from '@/types/event';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import Toggle from '@/components/common/Toggle';
import EventBasicFields from './EventBasicFields';
import EventCategoryPicker from './EventCategoryPicker';
import EventRepeatConfig from './EventRepeatConfig';
import EventReminderConfig from './EventReminderConfig';

export interface FormState {
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

export interface FormErrors {
  title?: string;
  date?: string;
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

export default function EventModal() {
  const { isEventModalOpen, editingEventId, closeEventModal } = useUIStore();
  const { addEvent, updateEvent, deleteEvent, getEventById } = useEventsStore();

  const [form, setForm] = useState<FormState>(getDefaultFormState());
  const [errors, setErrors] = useState<FormErrors>({});

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
        <Section title="基本信息" icon={<Info className="w-4 h-4" />}>
          <EventBasicFields form={form} updateForm={updateForm} errors={errors} />
        </Section>

        <Section title="选择分类" icon={<Info className="w-4 h-4" />}>
          <EventCategoryPicker form={form} updateForm={updateForm} />
        </Section>

        <Section title="重复规则" icon={<Repeat className="w-4 h-4" />}>
          <EventRepeatConfig form={form} updateForm={updateForm} />
        </Section>

        <Section title="提醒设置" icon={<Bell className="w-4 h-4" />}>
          <EventReminderConfig form={form} updateForm={updateForm} />
        </Section>

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
