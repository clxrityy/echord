"use client";
import { useContextFactory } from '@/hooks/useContextFactory';
import { useSessionStore } from './useSession';

export type SessionContextState = {
  sessionId: string;
  userId: string;
  setSessionId: (sessionId: string) => void;
  setUserId: (userId: string) => void;
  searches: string[];
  addSearch: (search: string) => void;
  setSearches: (searches: string[]) => void;
  removeSearch: (search: string) => void;
  clearSearches: () => void;
  getSessionId: () => string;
  getSearches: () => string[];
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
};

export const { Provider: SessionProvider, useContext: useSession } = useContextFactory<SessionContextState>(
  initialSessionContextState,
  useSessionStore
);
