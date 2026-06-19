import { create } from 'zustand';

interface UIState {
  activeView: 'grid' | 'widget';
  activeCategoryId: string | 'all';
  sortBy: 'date' | 'created' | 'pinned';
  searchQuery: string;
  isEventModalOpen: boolean;
  editingEventId: string | null;
  isShareModalOpen: boolean;
  shareEventId: string | null;
  selectedShareTemplate: 'minimal' | 'warm' | 'festival' | 'business';
  setActiveView: (view: 'grid' | 'widget') => void;
  setActiveCategoryId: (id: string | 'all') => void;
  setSortBy: (sort: 'date' | 'created' | 'pinned') => void;
  setSearchQuery: (query: string) => void;
  setIsEventModalOpen: (open: boolean) => void;
  setEditingEventId: (id: string | null) => void;
  setIsShareModalOpen: (open: boolean) => void;
  setShareEventId: (id: string | null) => void;
  setSelectedShareTemplate: (template: 'minimal' | 'warm' | 'festival' | 'business') => void;
  openCreateModal: () => void;
  openEditModal: (id: string) => void;
  closeEventModal: () => void;
  openShareModal: (id: string) => void;
  closeShareModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeView: 'grid',
  activeCategoryId: 'all',
  sortBy: 'pinned',
  searchQuery: '',
  isEventModalOpen: false,
  editingEventId: null,
  isShareModalOpen: false,
  shareEventId: null,
  selectedShareTemplate: 'warm',

  setActiveView: (view) => set({ activeView: view }),
  setActiveCategoryId: (id) => set({ activeCategoryId: id }),
  setSortBy: (sort) => set({ sortBy: sort }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setIsEventModalOpen: (open) => set({ isEventModalOpen: open }),
  setEditingEventId: (id) => set({ editingEventId: id }),
  setIsShareModalOpen: (open) => set({ isShareModalOpen: open }),
  setShareEventId: (id) => set({ shareEventId: id }),
  setSelectedShareTemplate: (template) => set({ selectedShareTemplate: template }),

  openCreateModal: () => set({ isEventModalOpen: true, editingEventId: null }),
  openEditModal: (id) => set({ isEventModalOpen: true, editingEventId: id }),
  closeEventModal: () => set({ isEventModalOpen: false, editingEventId: null }),
  openShareModal: (id) => set({ isShareModalOpen: true, shareEventId: id }),
  closeShareModal: () => set({ isShareModalOpen: false, shareEventId: null }),
}));
