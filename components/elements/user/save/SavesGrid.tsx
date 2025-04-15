import { ImageComponent } from '@/components/ui/Image';
import { EInteractionData } from '@prisma/client';
import { Save } from './Save';
import { Suspense } from 'react';
import Skeleton from '@/components/ui/Skeleton';
import { TrackModal } from './TrackModal';

interface SavesGridProps {
  saves: EInteractionData[];
}

export function SavesGrid({ saves }: SavesGridProps) {
  const length = saves.length;

  const determineSize = (ln: number) => {
    if (ln > 50) {
      return 10;
    } else if (ln > 40) {
      return 12;
    } else if (ln > 30) {
      return 15;
    } else if (ln > 20) {
      return 20;
    } else if (ln > 10) {
      return 25;
    } else if (ln > 5) {
      return 30;
    }
    if (ln > 28) {
      return 15;
    }
    if (ln > 2) {
      return 25;
    } else if (ln === 2) {
      return 50;
    } else {
      return 75;
    }
  };

  return (
    <div className='flex flex-col gap-0 h-screen mt-22 justify-end items-start fixed bottom-0 left-0'>
      {saves.map((save, idx) => (
        <Suspense
          key={idx}
          fallback={
            <Skeleton
              className='animate-pulse rounded-lg bg-zinc-200/50'
              style={{
                width: determineSize(length),
                height: determineSize(length),
              }}
            />
          }
        >
          <Save>
            {save.albumId && save.imageUrl && save.artistName && (
              <ImageComponent
                src={save.imageUrl}
                alt={save.dataId}
                width={determineSize(length)}
                height={determineSize(length)}
                className='rounded-lg'
              />
            )}
          </Save>
          <Suspense>
            <TrackModal />
          </Suspense>
        </Suspense>
      ))}
    </div>
  );
}
