'use client';

import { Button } from '@/components/ui';
import { useInteractions } from '@/contexts';
import { ICONS } from '@/utils';
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
  const [nodeTimeout, setNodeTimeout] = useState<NodeJS.Timeout | null>(null);

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
  }, [trackId, userId, interactions, favorited]);

  useEffect(() => {
    if (loading && !favorited && interactions) {
      console.log('Checking favorited status...');
      checkFavorited();
    }

    return () => {
      if (nodeTimeout) {
        clearTimeout(nodeTimeout);
      }
      setNodeTimeout(null);
    };
  }, [interactions, favorited, trackId, userId, loading, checkFavorited, nodeTimeout]);

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
        const timeout = setTimeout(() => {
          addInteraction(interaction);
          setFavorited(true);
          toast.success('Favorited successfully', {
            id: toastId,
          });
        }, 1000);
        setNodeTimeout(timeout);
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
      className={`${loading ? "cursor-none" : "disabled:text-red-500/80 hover:text-gray-300 focus:text-blue-400 disabled:hover:text-red-500/80 disabled:cursor-not-allowed transition-all duration-200 ease-in-out" }`}
      title='Favorite'
      disabled={favorited || loading}
      onClick={async () => await handleFavorite()}
    >
      {
        loading ? (
          <ICONS.loading className='animate-spin' />
        ) : (
          <ICONS.favorite
          />
        )
      }
      <span className='sr-only'>{favorited ? 'Favorited' : 'Favorite'}</span>
    </Button>
  );
}
