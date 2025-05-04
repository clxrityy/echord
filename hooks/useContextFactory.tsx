'use client';
import { createContext, FC, ReactNode, useContext } from 'react';

export type ContextFactory = <T>(
  _initialContextState: T,
  _useContextState: () => T
) => {
  Provider: FC<{ children: ReactNode }>;
  useContext:  () => T;
};

export const useContextFactory: ContextFactory = (
  initialContextState,
  useContextState
) => {
  const Context = createContext(initialContextState);

  return {
    Provider: ({ children }) => {
      const contextValue = useContextState();
      return (
        <Context.Provider value={contextValue}>{children}</Context.Provider>
      );
    },
    useContext: () => useContext(Context),
  };
};
