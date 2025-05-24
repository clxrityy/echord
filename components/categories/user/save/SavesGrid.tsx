'use client';

import { EInteractionData } from '@/prisma/app/generated/prisma/client';
import { UserSave } from './UserSave';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { Skeleton, ImageComponent } from '@/components/ui';
import { useScreenSize } from '@/hooks/useScreenSize';

interface SavesGridProps {
  saves: EInteractionData[];
}

export function SavesGrid({ saves }: Readonly<SavesGridProps>) {
  const length = saves.length;

  const screenSize = useScreenSize();

  const determineSize = useCallback(
    (ln: number, screenSize: { width: number; height: number }) => {
      const { width } = screenSize;

      // Define breakpoints
      let baseSize;
      if (ln > 50) baseSize = 10;
      else if (ln > 40) baseSize = 12;
      else if (ln > 30) baseSize = 15;
      else if (ln > 20) baseSize = 20;
      else if (ln > 10) baseSize = 25;
      else if (ln > 5) baseSize = 30;
      else if (ln > 2) baseSize = 25;
      else if (ln === 2) baseSize = 50;
      else baseSize = 75;

      // Adjust for screen width
      if (width < 480) return baseSize * 0.6; // Small screens
      if (width < 768) return baseSize * 0.8; // Medium screens

      return baseSize; // Large screens
    },
    [screenSize, length]
  );

  const [size, setSize] = useState(determineSize(length, screenSize));

  useEffect(() => {
    setSize(determineSize(length, screenSize));
  }, [screenSize, length]);

  return (
    <div className='flex flex-col gap-0 h-screen mt-22 justify-end items-start fixed bottom-0 left-0'>
      {saves.map((save) => (
        <Suspense
          key={save.id}
          fallback={
            <Skeleton
              className='animate-pulse rounded-lg bg-zinc-200/50'
              style={{
                width: size,
                height: size,
              }}
            />
          }
        >
          <UserSave key={save.id} save={save}>
            {save.albumId && save.imageUrl && save.artistName && (
              <ImageComponent
                crossOrigin='anonymous'
                src={save.imageUrl}
                alt={save.dataId}
                width={size}
                height={size}
                className='rounded-md'
              />
            )}
          </UserSave>
        </Suspense>
      ))}
    </div>
  );
}
