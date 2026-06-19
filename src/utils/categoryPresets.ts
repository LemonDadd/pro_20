import type { CategoryConfig } from '../types/category';

export const CATEGORY_PRESETS: CategoryConfig[] = [
  {
    id: 'birthday',
    name: '生日',
    color: '#FF8FAB',
    gradient: ['#FF8FAB', '#FFC3D0'],
    icon: '🎂',
  },
  {
    id: 'anniversary',
    name: '纪念日',
    color: '#FFD93D',
    gradient: ['#FFD93D', '#FFE66D'],
    icon: '💝',
  },
  {
    id: 'exam',
    name: '考试',
    color: '#6BCB77',
    gradient: ['#6BCB77', '#95E1A3'],
    icon: '📚',
  },
  {
    id: 'travel',
    name: '旅行',
    color: '#4D96FF',
    gradient: ['#4D96FF', '#7EB3FF'],
    icon: '✈️',
  },
  {
    id: 'salary',
    name: '发薪',
    color: '#6BCB77',
    gradient: ['#6BCB77', '#A8E6CF'],
    icon: '💰',
  },
  {
    id: 'deadline',
    name: 'Deadline',
    color: '#9B59B6',
    gradient: ['#9B59B6', '#BE88D1'],
    icon: '⏰',
  },
  {
    id: 'custom',
    name: '自定义',
    color: '#FF6B6B',
    gradient: ['#FF6B6B', '#FFA07A'],
    icon: '⭐',
  },
];

export function getCategoryById(id: string): CategoryConfig {
  return (
    CATEGORY_PRESETS.find((cat) => cat.id === id) || {
      id: 'custom',
      name: '自定义',
      color: '#FF6B6B',
      gradient: ['#FF6B6B', '#FFA07A'],
      icon: '⭐',
    }
  );
}
