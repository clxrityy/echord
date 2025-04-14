'use client';
import { create } from 'zustand';
import { WindowContextState } from '.';

export const useWindowStore = create<WindowContextState>((set, get) => ({
  width: 0,
  height: 0,
  setWindowSize: (width: number, height: number) => set({ width, height }),
  getWindowSize: () => ({ width: get().width, height: get().height }),
}));
