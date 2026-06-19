import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  mode: 'light' | 'dark';
  accentColor: string;
  toggleMode: () => void;
  setMode: (mode: 'light' | 'dark') => void;
  setAccentColor: (color: string) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'light',
      accentColor: '#FF6B6B',

      toggleMode: () =>
        set((state) => ({
          mode: state.mode === 'light' ? 'dark' : 'light',
        })),

      setMode: (mode) => set({ mode }),

      setAccentColor: (color) => set({ accentColor: color }),
    }),
    {
      name: 'countdown-theme-v1',
    }
  )
);
