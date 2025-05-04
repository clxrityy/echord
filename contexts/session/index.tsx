'use client';
import { useContextFactory } from '@/hooks/useContextFactory';
import { useSessionStore } from './useSession';

export type SessionContextState = {
  sessionId: string;
  userId: string;
  setSessionId: (_sessionId: string) => void;
  setUserId: (_userId: string) => void;
  searches: string[];
  addSearch: (_search: string) => void;
  setSearches: (_searches: string[]) => void;
  removeSearch: (_search: string) => void;
  clearSearches: () => void;
  getSessionId: () => string;
  getSearches: () => string[];
  getUserId: () => string;
};

const initialSessionContextState: SessionContextState = {
  sessionId: '',
  userId: '',
  setSessionId: () => {},
  setUserId: () => {},
  searches: [],
  addSearch: () => {},
  setSearches: () => {},
  removeSearch: () => {},
  clearSearches: () => {},
  getSessionId: () => '',
  getSearches: () => [],
  getUserId: () => '',
};

export const { Provider: SessionProvider, useContext: useSession } =
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useContextFactory<SessionContextState>(
    initialSessionContextState,
    useSessionStore
  );
