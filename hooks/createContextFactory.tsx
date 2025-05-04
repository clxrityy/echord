'use client';
import { createContext, useContext, ReactNode, FC } from 'react';

export type ContextFactory = <T>(
  _initialContextState: T,
  _useContextState: () => T
) => {
  Provider: FC<{ children: ReactNode }>;
  useContext: () => T;
};

export const createContextFactory = <T,>(
  initialContextState: T,
  useContextState: () => T
) => {
  const Context = createContext<T>(initialContextState);

  const Provider: FC<{ children: ReactNode }> = ({ children }) => {
    const contextValue = useContextState();
    return <Context.Provider value={contextValue}>{children}</Context.Provider>;
  };

  const useCustomContext = () => useContext(Context);

  return { Provider, useContext: useCustomContext };
};
