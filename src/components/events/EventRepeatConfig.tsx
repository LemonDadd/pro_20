import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { RepeatType } from '@/types/event';
import type { FormState } from './EventModal';
import Input from '@/components/common/Input';

const REPEAT_OPTIONS: { label: string; value: RepeatType }[] = [
  { label: '不重复', value: 'none' },
  { label: '每年', value: 'yearly' },
  { label: '每月', value: 'monthly' },
  { label: '每周', value: 'weekly' },
  { label: '自定义', value: 'custom' },
];

function getRepeatTabPosition(value: RepeatType): React.CSSProperties {
  const idx = REPEAT_OPTIONS.findIndex((o) => o.value === value);
  const pct = (100 / REPEAT_OPTIONS.length).toFixed(2);
  const left = `calc(${idx * parseFloat(pct)}% + 4px)`;
  const width = `calc(${pct}% - 8px)`;
  return { left, width };
}

interface EventRepeatConfigProps {
  form: FormState;
  updateForm: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}

export default function EventRepeatConfig({ form, updateForm }: EventRepeatConfigProps) {
  return (
    <div className="space-y-4">
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
    </div>
  );
}
