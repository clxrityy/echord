import { create } from 'zustand';
import { SessionContextState } from '.';

export const useSessionStore = create<SessionContextState>((set, get) => ({
  sessionId: '',
  userId: undefined,
  setSessionId: (sessionId: string) => set({ sessionId }),
  setUserId: (userId: string | undefined) => set({ userId }),
}));
