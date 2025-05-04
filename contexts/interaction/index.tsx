'use client';
import { useContextFactory } from '@/hooks/useContextFactory';
import { useInteractionsStore } from './useInteractions';
import { Interaction } from '@/types';

export type InteractionContextState = {
  interactions: Interaction[] | undefined;
  setInteractions: (_interactions: Interaction[]) => void;
  addInteraction: (_interaction: Interaction) => void;
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
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useContextFactory<InteractionContextState>(
    initialInteractionContextState,
    useInteractionsStore
  );
