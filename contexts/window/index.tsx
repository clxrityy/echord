'use client';
import { useContextFactory } from '@/hooks/useContextFactory';
import { useWindowStore } from './useWindow';
import { EUserAgent } from '@/prisma/app/generated/prisma/client';

export type WindowContextState = {
  width: number;
  height: number;
  setWindowSize: (width: number, height: number) => void;
  getWindowSize: () => { width: number; height: number };
  hasOpenModal: boolean;
  setCurrentOpenModal: (title: string) => void;
  currentOpenModal: {
    title: string;
  } | null;
  closeModal: () => void;
  getCurrentOpenModal: () => { title: string } | null;
  userAgent: Partial<EUserAgent> | null;
  setUserAgent: (userAgent: Partial<EUserAgent>) => void;
  getUserAgent: () => Partial<EUserAgent> | null;
};

const initialWindowContextState: WindowContextState = {
  width: 0,
  height: 0,
  setWindowSize: () => {},
  getWindowSize: () => ({ width: 0, height: 0 }),
  hasOpenModal: false,
  setCurrentOpenModal: () => {},
  currentOpenModal: null,
  closeModal: () => {},
  getCurrentOpenModal: () => null,
  userAgent: null,
  setUserAgent: () => {},
  getUserAgent: () => null,
};

export const { Provider: WindowProvider, useContext: useWindow } =
  useContextFactory<WindowContextState>(
    initialWindowContextState,
    useWindowStore
  );
