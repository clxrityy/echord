"use client";
import { contextFactory } from '@/utils/contextFactory';
import { useSessionStore } from './useSession';

export type SessionContextState = {
  sessionId: string;
  userId?: string;
  setSessionId: (sessionId: string) => void;
  setUserId: (userId: string | undefined) => void;
};

const initialSessionContextState: SessionContextState = {
  sessionId: '',
  userId: undefined,
  setSessionId: () => {},
  setUserId: () => {},
};

export const { Provider: SessionProvider, useContext: useSession } = contextFactory<SessionContextState>(
  initialSessionContextState,
  useSessionStore
);
