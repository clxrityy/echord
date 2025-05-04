'use client';
import { createContextFactory } from '@/hooks/createContextFactory';
import { useInteractionsStore } from './useInteractions';
import { Interaction } from '@/types';

export type InteractionContextState = {
  interactions: Interaction[] | undefined;
  setInteractions: (_interactions: Interaction[]) => void;
  addInteraction: (_interaction: Interaction) => void;
  getInteractions: () => Interaction[] | undefined;
  clearInteraction: () => void;
};

export const initialInteractionContextState: InteractionContextState = {
  interactions: undefined,
  setInteractions: () => {},
  addInteraction: () => {},
  getInteractions: () => undefined,
  clearInteraction: () => {},
};

export const { Provider: InteractionProvider, useContext: useInteractions } =
  createContextFactory<InteractionContextState>(
    initialInteractionContextState,
    useInteractionsStore
  );

export default InteractionProvider;
