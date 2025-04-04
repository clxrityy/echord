import { create } from 'zustand';
import { SessionContextState } from '.';

export const useSessionStore = create<SessionContextState>((set, get) => ({
  sessionId: '',
  userId: undefined,
  setSessionId: (sessionId: string) => set({ sessionId }),
  setUserId: (userId: string | undefined) => set({ userId }),
  searches: [],
  getSearches: () => get().searches,
  addSearch: (search: string) => set((state) => ({ searches: [...state.searches, search] })),
  setSearches: (searches: string[]) => set({ searches }),
  removeSearch: (search: string) => set(({searches}) => ({ searches: searches.filter((s) => s !== search) })),
  clearSearches: () => set({ searches: [] }),
  getSessionId: () => get().sessionId,
}));
