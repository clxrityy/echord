'use client';

import { Suspense, useEffect } from 'react';
import { SaveInteraction } from './SaveInteraction';
import { FavoriteInteraction } from './FavoriteInteraction';
import { RatingInteraction } from './RatingInteraction';
import { useInteractions } from '@/contexts';
import { Interaction } from '@/types';

interface Props {
  userId: string;
  trackId: string;
  initialInteractions: Interaction[] | [];
}

export function Interact({
  userId,
  trackId,
  initialInteractions,
}: Readonly<Props>) {
  const { setInteractions, getInteractions } = useInteractions();

  useEffect(() => {
    if (initialInteractions.length > 0 && getInteractions() === undefined) {
      setInteractions(initialInteractions);
    }
  }, [initialInteractions, setInteractions, getInteractions]);

  return (
    <div className='flex flex-col items-center justify-center gap-5'>
      <div className='flex items-center gap-2'>
        <Suspense>
          <SaveInteraction trackId={trackId} userId={userId} />
        </Suspense>
        <Suspense>
          <FavoriteInteraction trackId={trackId} userId={userId} />
        </Suspense>
      </div>
      <Suspense>
        <RatingInteraction userId={userId} trackId={trackId} />
      </Suspense>
    </div>
  );
}
