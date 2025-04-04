import { ReactNode } from 'react';

export function Main({ children }: { children: ReactNode}) {

  return (
    <div className='w-full max-w-7xl mx-auto px-4 py-2 relative'>
      {children}
    </div>
  );
}
