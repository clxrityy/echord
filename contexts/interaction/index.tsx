'use client';
import { useContextFactory } from '@/hooks/useContextFactory';
import { useInteractionsStore } from './useInteractions';
import { Interaction } from '@/types';

export type InteractionContextState = {
  interactions: Interaction[] | undefined;
  setInteractions: (interactions: Interaction[]) => void;
  addInteraction: (interaction: Interaction) => void;
  getInteractions: () => Interaction[] | undefined;
  clearInteraction: () => void;
};

const initialInteractionContextState: InteractionContextState = {
  interactions: undefined,
  setInteractions: () => {},
  addInteraction: () => {},
  getInteractions: () => undefined,
  clearInteraction: () => {},
};

export const { Provider: InteractionProvider, useContext: useInteractions } =
  useContextFactory<InteractionContextState>(
    initialInteractionContextState,
    useInteractionsStore
  );
