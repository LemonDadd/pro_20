import { motion } from 'framer-motion';
import { CATEGORY_PRESETS } from '@/utils/categoryPresets';
import { cn } from '@/lib/utils';
import type { FormState } from './EventModal';

interface EventCategoryPickerProps {
  form: FormState;
  updateForm: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}

export default function EventCategoryPicker({ form, updateForm }: EventCategoryPickerProps) {
  return (
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
  );
}
