'use client';
import { Dialog, DialogProps, Skeleton } from '@/components/ui';
import { Interaction } from '@/types';
import { Suspense, useEffect, useState } from 'react';

interface InteractionModalProps extends DialogProps {
  interactionId: string;
}

export function InteractionModal({
  onClose,
  open,
  interactionId,
  children,
  ...props
}: InteractionModalProps) {
  const [interaction, setInteraction] = useState<Interaction | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInteraction = async () => {
      try {
        const res = await fetch(`/api/interaction?id=${interactionId}`, {
          method: 'GET',
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) {
          setError('Failed to fetch interaction');
        }
        const { interaction: interactionData } = await res.json();
        setInteraction(interactionData);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError('Failed to fetch interaction');
      } finally {
        setLoading(false);
      }
    };

    if (!interaction && interactionId) {
      fetchInteraction();
    }
  }, [interactionId, interaction]);

  return (
    <Suspense>
      <Dialog {...props} open={open} onClose={onClose}>
        {loading ? (
          <Skeleton className='w-full h-full bg-gray-400/30 animate-pulse rounded-full shadow-2xl' />
        ) : (
          <div>
            <div className='flex flex-col items-start justify-start w-full gap-2'>
              <h2 className='text-lg font-semibold'>
                {interaction?.user.username}
              </h2>
              <p className='text-gray-600'>
                {interaction?.eAlbum
                  ? interaction.eAlbum.title
                  : interaction?.eTrack && interaction.eTrack.title}
              </p>
            </div>
            <div className='flex flex-col items-start justify-start w-full gap-4 mt-4'>
              {error && <p className='text-red-500'>{error}</p>}
              {children}
            </div>
          </div>
        )}
      </Dialog>
    </Suspense>
  );
}
