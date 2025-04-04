"use client";
import { contextFactory } from '@/utils';
import { useSessionStore } from './useSession';

export type SessionContextState = {
  sessionId: string;
  userId?: string;
  setSessionId: (sessionId: string) => void;
  setUserId: (userId: string | undefined) => void;
  searches: string[];
  addSearch: (search: string) => void;
  setSearches: (searches: string[]) => void;
  removeSearch: (search: string) => void;
  clearSearches: () => void;
  getSessionId: () => string;
};

const initialSessionContextState: SessionContextState = {
  sessionId: '',
  userId: undefined,
  setSessionId: () => {},
  setUserId: () => {},
  searches: [],
  addSearch: () => {},
  setSearches: () => {},
  removeSearch: () => {},
  clearSearches: () => {},
  getSessionId: () => '',
};

export const { Provider: SessionProvider, useContext: useSession } = contextFactory<SessionContextState>(
  initialSessionContextState,
  useSessionStore
);
