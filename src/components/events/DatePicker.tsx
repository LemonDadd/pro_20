import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import type { DateType, LunarDate } from '@/types/event';
import {
  getLunarMonthDays,
  GAN,
  ZHI,
  LUNAR_MONTH_NAMES,
  LUNAR_DAY_NAMES,
  getYearGanZhi,
  lunarInfo,
} from '@/utils/lunarConverter';
import { cn } from '@/lib/utils';

export interface DatePickerProps {
  dateType: DateType;
  solarDate: string;
  lunarDate?: LunarDate;
  onSolarChange: (date: string) => void;
  onLunarChange: (date: LunarDate) => void;
  onDateTypeChange: (type: DateType) => void;
}

function Select({
  value,
  onChange,
  options,
  placeholder,
  className,
}: {
  value: string | number;
  onChange: (v: string) => void;
  options: { value: string | number; label: string }[];
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'appearance-none w-full px-4 py-3 pr-10 rounded-2xl bg-white/80 border border-gray-200',
          'text-gray-800 outline-none transition-all duration-200',
          'focus:border-primary-400 focus:ring-4 focus:ring-primary-100',
          'cursor-pointer hover:border-gray-300',
          className
        )}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

export default function DatePicker({
  dateType,
  solarDate,
  lunarDate,
  onSolarChange,
  onLunarChange,
  onDateTypeChange,
}: DatePickerProps) {
  const yearOptions = useMemo(() => {
    const opts: { value: number; label: string }[] = [];
    for (let y = 1950; y <= 2100; y++) {
      opts.push({ value: y, label: `${y}年 (${getYearGanZhi(y)}年)` });
    }
    return opts;
  }, []);

  const monthOptions = useMemo(() => {
    const opts: { value: string; label: string }[] = [];
    const currentYear = lunarDate?.year ?? new Date().getFullYear();
    const leapMonthNum = getLeapMonthNum(currentYear);

    for (let m = 1; m <= 12; m++) {
      opts.push({ value: `n-${m}`, label: LUNAR_MONTH_NAMES[m - 1] });
      if (m === leapMonthNum) {
        opts.push({ value: `l-${m}`, label: `闰${LUNAR_MONTH_NAMES[m - 1]}` });
      }
    }
    return opts;
  }, [lunarDate?.year]);

  const dayOptions = useMemo(() => {
    if (!lunarDate) return [];
    const year = lunarDate.year;
    const month = lunarDate.month;
    const isLeap = lunarDate.isLeapMonth ?? false;
    const days = getLunarMonthDays(year, month, isLeap);
    const opts: { value: number; label: string }[] = [];
    for (let d = 1; d <= days; d++) {
      opts.push({ value: d, label: LUNAR_DAY_NAMES[d - 1] });
    }
    return opts;
  }, [lunarDate]);

  const handleMonthChange = (val: string) => {
    const [prefix, mStr] = val.split('-');
    const month = parseInt(mStr, 10);
    const isLeap = prefix === 'l';
    onLunarChange({
      year: lunarDate?.year ?? new Date().getFullYear(),
      month,
      day: 1,
      isLeapMonth: isLeap,
    });
  };

  const handleYearChange = (val: string) => {
    const year = parseInt(val, 10);
    onLunarChange({
      year,
      month: lunarDate?.month ?? 1,
      day: lunarDate?.day ?? 1,
      isLeapMonth: false,
    });
  };

  const handleDayChange = (val: string) => {
    const day = parseInt(val, 10);
    onLunarChange({
      year: lunarDate?.year ?? new Date().getFullYear(),
      month: lunarDate?.month ?? 1,
      day,
      isLeapMonth: lunarDate?.isLeapMonth ?? false,
    });
  };

  return (
    <div className="w-full space-y-4">
      <div className="relative flex rounded-2xl bg-white/80 p-1 border border-gray-200">
        <div
          className={cn(
            'absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl bg-gradient-primary shadow-soft transition-all duration-300',
            dateType === 'solar' ? 'left-1' : 'left-[calc(50%+4px)]'
          )}
        />
        <button
          type="button"
          onClick={() => onDateTypeChange('solar')}
          className={cn(
            'relative z-10 flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200',
            dateType === 'solar' ? 'text-white' : 'text-gray-600 hover:text-gray-800'
          )}
        >
          公历
        </button>
        <button
          type="button"
          onClick={() => onDateTypeChange('lunar')}
          className={cn(
            'relative z-10 flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200',
            dateType === 'lunar' ? 'text-white' : 'text-gray-600 hover:text-gray-800'
          )}
        >
          农历
        </button>
      </div>

      <motion.div
        key={dateType}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {dateType === 'solar' ? (
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="date"
              value={solarDate}
              onChange={(e) => onSolarChange(e.target.value)}
              className={cn(
                'w-full pl-12 pr-4 py-3 rounded-2xl bg-white/80 border border-gray-200',
                'text-gray-800 outline-none transition-all duration-200',
                'focus:border-primary-400 focus:ring-4 focus:ring-primary-100',
                'hover:border-gray-300'
              )}
            />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            <Select
              value={lunarDate?.year ?? new Date().getFullYear()}
              onChange={handleYearChange}
              options={yearOptions}
              placeholder="选择年"
            />
            <Select
              value={`${(lunarDate?.isLeapMonth ? 'l' : 'n')}-${lunarDate?.month ?? 1}`}
              onChange={handleMonthChange}
              options={monthOptions}
              placeholder="选择月"
            />
            <Select
              value={lunarDate?.day ?? 1}
              onChange={handleDayChange}
              options={dayOptions}
              placeholder="选择日"
            />
          </div>
        )}
      </motion.div>
    </div>
  );
}

function getLeapMonthNum(y: number): number {
  return lunarInfo[y - 1900] & 0xf;
}
