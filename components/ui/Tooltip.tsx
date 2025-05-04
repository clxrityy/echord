'use client';

import { capitalizeFirstLetter } from '@/util';
import { ReactNode, useState } from 'react';

export function Tooltip({
  text,
  children,
}: Readonly<{
  text: string;
  children: ReactNode;
}>) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className='relative inline-block'
      onMouseEnter={(e) => {
        e.stopPropagation();
        setIsVisible(true);
      }}
      onMouseLeave={(e) => {
        e.stopPropagation();
        setIsVisible(false);
      }}
      role='tooltip'
    >
      {children}
      {isVisible && (
        <div className='absolute top-[calc(100%+0.35rem)] transform-[translateX(-40%)] bg-gray-950/55 text-zinc-100/90 text-sm rounded py-1 px-2 z-60 transition-all duration-200 ease-out font-mono font-semibold tracking-wide h-auto flex items-center justify-center'>
          {capitalizeFirstLetter(text)}
          <span className='sr-only'>{text}</span>
        </div>
      )}
    </div>
  );
}
