import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CountdownEvent } from '../types/event';
import { generateUUID } from '../utils/uuid';

interface EventsState {
  events: CountdownEvent[];
  hydrated: boolean;
  addEvent: (
    eventData: Omit<CountdownEvent, 'id' | 'createdAt' | 'updatedAt'>
  ) => void;
  updateEvent: (
    id: string,
    updates: Partial<Omit<CountdownEvent, 'id' | 'createdAt'>>
  ) => void;
  deleteEvent: (id: string) => void;
  togglePin: (id: string) => void;
  reorderEvents: (orderedIds: string[]) => void;
  hydrateFromMock: (mockEvents: CountdownEvent[]) => void;
  setHydrated: (v: boolean) => void;
  getEventById: (id: string) => CountdownEvent | undefined;
}

export const useEventsStore = create<EventsState>()(
  persist(
    (set, get) => ({
      events: [],
      hydrated: false,

      addEvent: (eventData) => {
        const now = Date.now();
        const newEvent: CountdownEvent = {
          ...eventData,
          id: generateUUID(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ events: [...state.events, newEvent] }));
      },

      updateEvent: (id, updates) => {
        set((state) => ({
          events: state.events.map((e) =>
            e.id === id ? { ...e, ...updates, updatedAt: Date.now() } : e
          ),
        }));
      },

      deleteEvent: (id) => {
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
        }));
      },

      togglePin: (id) => {
        set((state) => ({
          events: state.events.map((e) =>
            e.id === id ? { ...e, isPinned: !e.isPinned, updatedAt: Date.now() } : e
          ),
        }));
      },

      reorderEvents: (orderedIds) => {
        set((state) => {
          const map = new Map(state.events.map((e) => [e.id, e]));
          const reordered = orderedIds
            .map((id) => map.get(id))
            .filter(Boolean) as CountdownEvent[];
          const remaining = state.events.filter(
            (e) => !orderedIds.includes(e.id)
          );
          return { events: [...reordered, ...remaining] };
        });
      },

      hydrateFromMock: (mockEvents) => {
        if (get().events.length === 0) {
          set({ events: mockEvents });
        }
        set({ hydrated: true });
      },

      setHydrated: (v) => set({ hydrated: v }),

      getEventById: (id) => get().events.find((e) => e.id === id),
    }),
    {
      name: 'countdown-events-v1',
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    }
  )
);
