'use client';

import { Button } from '@/components/ui';
import { useInteractions } from '@/contexts';
import { ICONS } from '@/util';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export function FavoriteInteraction({
  userId,
  trackId,
}: {
  userId: string;
  trackId: string;
}) {
  const [favorited, setFavorited] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const { addInteraction, getInteractions } = useInteractions();

  const interactions = getInteractions();

  const checkFavorited = useCallback(() => {
    if (interactions) {
      const interaction = interactions.find((interaction) => {
        return (
          interaction?.interactionType === 'FAVORITED' &&
          interaction.interactionData?.trackId === trackId &&
          interaction.userId === userId
        );
      });

      if (interaction && interaction.interactionData) {
        setFavorited(true);
      }
    }

    setLoading(false);
  }, [interactions, trackId, userId]);

  useEffect(() => {
    checkFavorited();
  }, [interactions, favorited, trackId, userId, loading]);

  const handleFavorite = async () => {
    const toastId = toast.loading('Favoriting...');

    try {
      const response = await fetch('/api/interaction/favorite', {
        method: 'POST',
        body: JSON.stringify({
          trackId,
          userId,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { interaction, error } = await response.json();

      if (response.status !== 200) {
        console.error('Error favoriting:', error);
        toast.error('Failed to favorite', {
          id: toastId,
        });
        return;
      }

      if (error) {
        toast.error(`Failed to favorite track: ${error}`, {
          id: toastId,
        });
        return;
      }

      if (interaction) {
        setLoading(true);
        setTimeout(() => {
          toast.success('Favorited successfully', {
            id: toastId,
          });
          setFavorited(true);
          addInteraction(interaction);
          setLoading(false);
        }, 1000);
      }
    } catch (error) {
      console.error('Error favoriting:', error);
      toast.error('Failed to favorite', {
        id: toastId,
      });
    }
  };

  return (
    <Button
      className={`${loading ? 'cursor-none' : 'disabled:text-red-500/80 hover:text-gray-300 focus:text-blue-400 disabled:hover:text-red-500/80 disabled:cursor-not-allowed transition-all duration-200 ease-in-out cursor-pointer z-20'}`}
      title='Favorite'
      disabled={favorited || loading}
      onClick={async () => await handleFavorite()}
    >
      {loading ? (
        <ICONS.loading className='animate-spin' />
      ) : (
        <ICONS.favorite />
      )}
      <span className='sr-only'>{favorited ? 'Favorited' : 'Favorite'}</span>
    </Button>
  );
}
