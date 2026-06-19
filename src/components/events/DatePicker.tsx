import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import type { DateType, LunarDate } from '@/types/event';
import { getLunarMonthDays } from '@/utils/lunarConverter';
import { cn } from '@/lib/utils';

export interface DatePickerProps {
  dateType: DateType;
  solarDate: string;
  lunarDate?: LunarDate;
  onSolarChange: (date: string) => void;
  onLunarChange: (date: LunarDate) => void;
  onDateTypeChange: (type: DateType) => void;
}

const lunarMonthNames = [
  '正月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '冬月', '腊月',
];

const lunarDayNames = [
  '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十',
];

const Gan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const Zhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

function getYearGanZhi(year: number): string {
  return Gan[(year - 4) % 10] + Zhi[(year - 4) % 12];
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
      opts.push({ value: `n-${m}`, label: lunarMonthNames[m - 1] });
      if (m === leapMonthNum) {
        opts.push({ value: `l-${m}`, label: `闰${lunarMonthNames[m - 1]}` });
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
      opts.push({ value: d, label: lunarDayNames[d - 1] });
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
  const lunarInfo: number[] = [
    0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
    0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
    0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
    0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
    0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
    0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0,
    0x0aea6, 0x0ab50, 0x04b60, 0x04b60, 0x0a571, 0x0a2e0, 0x0d273, 0x029e5, 0x092b0, 0x1a974,
    0x068b0, 0x06ca0, 0x1b554, 0x053b0, 0x04bb0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, 0x17965,
    0x0e4d0, 0x0d260, 0x1eb50, 0x16096, 0x095b0, 0x04bb0, 0x0aab7, 0x052b0, 0x068b0, 0x050e4,
    0x064b0, 0x0dae0, 0x0d463, 0x056a0, 0x055e0, 0x0a3d4, 0x0a2e0, 0x0d2e0, 0x0e9d5, 0x0a960,
    0x04970, 0x064b0, 0x04ab5, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, 0x05aa0, 0x076a3,
    0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x0d0b6, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0,
    0x195a6, 0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46,
    0x0ab60, 0x09570, 0x04af5, 0x04970, 0x064b0, 0x068a6, 0x0d4a0, 0x0ea50, 0x06b55,
    0x05ac0, 0x0ab60, 0x096d4, 0x092e0, 0x0c960, 0x0d954, 0x0d4a0, 0x0d550, 0x0b595,
    0x056a0, 0x0a6e0, 0x0aed3, 0x092e0, 0x0c968, 0x0c950, 0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0,
    0x1a5c4, 0x025d0, 0x092d0, 0x0da2, 0x0a950, 0x0b557, 0x06ca0, 0x0b550, 0x15355,
    0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a5b6, 0x0e4d0, 0x06aa0, 0x0aea6, 0x0ab50,
    0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, 0x0a6d0,
    0x055b4, 0x025d0, 0x092d0, 0x0a9b8, 0x06ca0, 0x06d40, 0x1af45, 0x0ab60, 0x09570,
    0x04970, 0x068b6, 0x0ece0, 0x0d27c, 0x0d520, 0x0daa0, 0x16a65, 0x09300, 0x04970,
    0x064b0, 0x0d4a4, 0x0ea60, 0x0d550, 0x0b456, 0x0cf30, 0x0c8e0, 0x1a958, 0x093b0, 0x14970
  ];
  return lunarInfo[y - 1900] & 0xf;
}
