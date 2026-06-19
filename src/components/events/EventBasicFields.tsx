import { useCallback } from 'react';
import { AlertCircle } from 'lucide-react';
import { lunarToSolar, solarToLunar } from '@/utils/lunarConverter';
import { cn } from '@/lib/utils';
import type { DateType, LunarDate } from '@/types/event';
import type { FormState, FormErrors } from './EventModal';
import Input from '@/components/common/Input';
import DatePicker from './DatePicker';

const EMOJI_PRESETS = [
  '🎂', '💝', '📚', '✈️', '💰', '⏰', '🎄', '🏮', '🎉', '🎓',
  '💍', '🏆', '🎵', '🎨', '🍰', '🏖️', '🎁', '🎯', '💡', '⭐',
];

interface EventBasicFieldsProps {
  form: FormState;
  updateForm: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  errors?: FormErrors;
}

export default function EventBasicFields({ form, updateForm, errors }: EventBasicFieldsProps) {
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

  return (
    <div className="space-y-4">
      <Input
        label="事件名称"
        placeholder="例如：我的生日"
        required
        value={form.title}
        onChange={(e) => updateForm('title', e.target.value)}
        error={errors?.title}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">选择图标</label>
        <div className="grid grid-cols-10 gap-2">
          {EMOJI_PRESETS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => updateForm('icon', emoji)}
              className={cn(
                'aspect-square flex items-center justify-center rounded-xl text-2xl transition-all duration-200',
                form.icon === emoji
                  ? 'bg-gradient-primary text-white shadow-soft ring-2 ring-primary-400 ring-offset-2'
                  : 'bg-white/70 border border-gray-200 hover:border-primary-300 hover:bg-white'
              )}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <DatePicker
        dateType={form.dateType}
        solarDate={form.solarDate}
        lunarDate={form.lunarDate}
        onSolarChange={handleSolarChange}
        onLunarChange={handleLunarChange}
        onDateTypeChange={handleDateTypeChange}
      />
      {errors?.date && (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {errors.date}
        </p>
      )}
    </div>
  );
}
