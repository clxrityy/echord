'use client';
import { useContextFactory } from '@/hooks/useContextFactory';
import { useWindowStore } from './useWindow';
import { EUserAgent } from '@/prisma/app/generated/prisma/client';

export type WindowContextState = {
  width: number;
  height: number;
  setWindowSize: (_width: number, _height: number) => void;
  getWindowSize: () => { width: number; height: number };
  userAgent: Partial<EUserAgent> | null;
  setUserAgent: (_userAgent: Partial<EUserAgent>) => void;
  getUserAgent: () => Partial<EUserAgent> | null;
};

export const initialWindowContextState: WindowContextState = {
  width: 0,
  height: 0,
  setWindowSize: () => {},
  getWindowSize: () => ({ width: 0, height: 0 }),
  userAgent: null,
  setUserAgent: () => {},
  getUserAgent: () => null,
};

export const { Provider: WindowProvider, useContext: useWindow } =
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useContextFactory<WindowContextState>(
    initialWindowContextState,
    useWindowStore
  );
