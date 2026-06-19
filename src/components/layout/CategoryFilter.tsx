import { ArrowUpDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUIStore } from '@/store/uiStore';
import { CATEGORY_PRESETS } from '@/utils/categoryPresets';
import { cn } from '@/lib/utils';

const SORT_OPTIONS: { value: 'date' | 'created' | 'pinned'; label: string }[] = [
  { value: 'pinned', label: '置顶优先' },
  { value: 'date', label: '日期排序' },
  { value: 'created', label: '创建时间' },
];

export default function CategoryFilter() {
  const { activeCategoryId, setActiveCategoryId, sortBy, setSortBy } = useUIStore();

  const cycleSort = () => {
    const currentIndex = SORT_OPTIONS.findIndex((opt) => opt.value === sortBy);
    const nextIndex = (currentIndex + 1) % SORT_OPTIONS.length;
    setSortBy(SORT_OPTIONS[nextIndex].value);
  };

  const currentSortLabel = SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label || '置顶优先';

  return (
    <div className="container flex items-center justify-between gap-3 py-3">
      <div className="flex flex-1 gap-2 overflow-x-auto py-2 scrollbar-hide">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveCategoryId('all')}
          className={cn(
            'flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all',
            activeCategoryId === 'all'
              ? 'bg-gradient-primary text-white shadow-soft'
              : 'glass-card text-gray-600 hover:bg-white/80'
          )}
        >
          <span>🌟</span>
          <span>全部</span>
        </motion.button>

        {CATEGORY_PRESETS.map((category) => (
          <motion.button
            key={category.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategoryId(category.id)}
            className={cn(
              'flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all',
              activeCategoryId === category.id
                ? 'text-white shadow-soft'
                : 'glass-card text-gray-600 hover:bg-white/80'
            )}
            style={
              activeCategoryId === category.id
                ? {
                    background: `linear-gradient(135deg, ${category.gradient[0]} 0%, ${category.gradient[1]} 100%)`,
                  }
                : undefined
            }
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </motion.button>
        ))}
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={cycleSort}
        className="flex shrink-0 items-center gap-1.5 rounded-full glass-card px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-white/80"
      >
        <ArrowUpDown className="h-4 w-4" />
        <span className="hidden sm:inline">{currentSortLabel}</span>
      </motion.button>
    </div>
  );
}
