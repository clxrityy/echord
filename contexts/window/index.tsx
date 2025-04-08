"use client";
import { useContextFactory } from '@/hooks/useContextFactory';
import { useWindowStore } from './useWindow';

export type WindowContextState = {
  width: number;
  height: number;
  setWindowSize: (width: number, height: number) => void;
  getWindowSize: () => { width: number; height: number };
}

const initialWindowContextState: WindowContextState = {
  width: 0,
  height: 0,
  setWindowSize: () => {},
  getWindowSize: () => ({ width: 0, height: 0 }),
};

export const { Provider: WindowProvider, useContext: useWindow } = useContextFactory<WindowContextState>(
  initialWindowContextState,
  useWindowStore,
)
