import { create } from 'zustand';
import { InteractionContextState } from '.';

export const useInteractionsStore = create<InteractionContextState>(
  (set, get) => ({
    interactions: undefined,
    setInteractions: (interactions) => set({ interactions }),
    addInteraction: (interaction) =>
      set({ interactions: [...(get().interactions || []), interaction] }),
    getInteractions: () => get().interactions,
    clearInteraction: () => set({ interactions: undefined }),
  })
);
