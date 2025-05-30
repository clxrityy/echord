'use client';
import { Dialog, DialogProps, Skeleton } from '@/components/ui';
import { EInteractionType } from '@/prisma/app/generated/prisma/client';
import { Interaction } from '@/types';
import { ICONS } from '@/util';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';

interface InteractionModalProps extends DialogProps {
  interactionId: string;
}

const {
  favorite: IconFavorite,
  save: IconSave,
  star: IconRate,
  loading: IconLoading,
} = ICONS;

export function InteractionModal({
  onClose,
  open,
  interactionId,
  children,
  ...props
}: Readonly<InteractionModalProps>) {
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
              <h2 className='text-lg font-semibold flex items-center gap-2'>
                {interaction?.user.username}{' '}
                {Icon(interaction?.interactionType as EInteractionType)}
              </h2>
              {interaction?.albumId && (
                <Link
                  href={`/album/${interaction.albumId}`}
                  className='hover:underline underline-offset-2 hover:text-gray-200 focus:underline-offset-4 transition-all duration-200 ease-in'
                >
                  <p className='text-gray-600'>
                    {interaction?.eAlbum
                      ? interaction.eAlbum.title
                      : interaction?.eTrack?.title}
                  </p>
                </Link>
              )}
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

const Icon = (type: EInteractionType) => {
  switch (type) {
    case EInteractionType.FAVORITED:
      return <IconFavorite />;
    case EInteractionType.SAVED:
      return <IconSave />;
    case EInteractionType.RATED:
      return <IconRate />;
    default:
      return <IconLoading className='animate-spin' />;
  }
};
