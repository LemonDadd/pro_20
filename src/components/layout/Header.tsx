import {
  LayoutGrid,
  Maximize2,
  Moon,
  Plus,
  Search,
  Sun,
  CalendarDays,
} from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useThemeStore } from '@/store/themeStore';
import { cn } from '@/lib/utils';

export default function Header() {
  const { searchQuery, setSearchQuery, activeView, setActiveView, openCreateModal } =
    useUIStore();
  const { mode, toggleMode } = useThemeStore();

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full',
        'glass-card'
      )}
      style={{ borderBottom: '1px solid var(--glass-border)' }}
    >
      <div className="container flex h-20 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-primary shadow-soft">
            <CalendarDays className="h-6 w-6 text-white" />
          </div>
          <h1 className="font-display text-xl font-bold text-gradient-primary">
            时光倒数
          </h1>
        </div>

        <div className="relative hidden md:block">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-on-glass" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索事件、日期..."
            className="w-[400px] max-w-full rounded-full glass-input px-5 py-2.5 pl-11 text-sm outline-none transition-all focus:shadow-soft"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="glass-btn-group flex items-center gap-1 rounded-2xl p-1">
            <button
              onClick={() => setActiveView('grid')}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-xl transition-all',
                activeView === 'grid' &&
                  'bg-gradient-primary text-white shadow-soft'
              )}
              title="网格视图"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setActiveView('widget')}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-xl transition-all',
                activeView === 'widget' &&
                  'bg-gradient-primary text-white shadow-soft'
              )}
              title="Widget 视图"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={toggleMode}
            className="glass-icon-btn flex h-9 w-9 items-center justify-center rounded-2xl transition-all"
            title={mode === 'light' ? '切换到深色模式' : '切换到浅色模式'}
          >
            {mode === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </button>

          <button
            onClick={openCreateModal}
            className="flex h-9 items-center gap-1.5 rounded-2xl bg-gradient-primary px-4 text-sm font-medium text-white shadow-soft transition-all hover:shadow-soft-lg"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">新建事件</span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center pb-4 md:hidden">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-on-glass" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索事件、日期..."
            className="w-full rounded-full glass-input px-5 py-2.5 pl-11 text-sm outline-none transition-all focus:shadow-soft"
          />
        </div>
      </div>
    </header>
  );
}
