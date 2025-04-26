'use client';
import { useInteractions } from '@/contexts';
import { ICONS } from '@/utils';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export function RatingInteraction({
  trackId,
  userId,
}: {
  trackId: string;
  userId: string;
}) {
  const [rating, setRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<number | null>(null);
  const [nodeTimeout, setNodeTimeout] = useState<NodeJS.Timeout | null>(null);

  const { addInteraction, getInteractions } = useInteractions();
  const interactions = getInteractions();

  const checkRating = useCallback(() => {
    if (interactions) {
      const interaction = interactions.find((interaction) => {
        return (
          interaction?.interactionType === 'RATED' &&
          interaction.interactionData?.trackId === trackId &&
          interaction.userId === userId
        );
      });

      if (interaction && interaction.interactionData) {
        setRating(interaction.interactionData.rating);
      } else {
        setRating(null);
      }
    } else {
      setRating(null);
    }
    setIsLoading(false);
  }, [interactions, trackId, userId]);

  useEffect(() => {
    if (rating === null && interactions) {
      checkRating();
    }

    return () => {
      if (nodeTimeout) {
        clearTimeout(nodeTimeout);
      }
      setNodeTimeout(null);
    }
  }, [interactions, isLoading, trackId, userId, isLoading, nodeTimeout]);

  const rate = useCallback(
    async (value: number) => {
      const toastId = toast.loading('Rating...');
      try {
        const response = await fetch(`/api/interaction/rate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            trackId,
            userId,
            value,
          }),
        });
        const { interaction } = (await response.json());

        if (interaction) {
          addInteraction(interaction);
          setRating(value);
          toast.success('Rated successfully', { id: toastId });
        } else {
          toast.error('Failed to rate', { id: toastId });
        }
      } catch (error) {
        toast.error('Failed to rate', { id: toastId });
        console.error('Error rating:', error);
      } finally {
        const timeout = setTimeout(() => {
          setIsHovered(null);
          toast.dismiss(toastId);
        }, 1000);
        setNodeTimeout(timeout);
      }
    },
    [trackId, userId, rating]
  );

  const determineColor = useCallback(
    (value: number) => {
      if (rating) {
        if (value <= rating) {
          return 'yellow';
        } else {
          return 'gray';
        }
      } else {
        if (value <= isHovered!) {
          return 'yellow';
        } else {
          return 'gray';
        }
      }
    },
    [rating, isHovered]
  );

  return (
    <div className='flex items-center gap-1 justify-end w-full'>
      {[1, 2, 3, 4, 5].map((value, idx) => {
        return isLoading ? (
          <ICONS.loading key={idx} className='animate-spin' />
        ) : (
          <ICONS.star
            onMouseOver={(e) => {
              e.preventDefault();
              setIsHovered(value);
            }}
            onMouseLeave={(e) => {
              e.preventDefault();
              setIsHovered(null);
            }}
            key={idx}
            color={determineColor(rating ? rating : value)}
            className='cursor-pointer transition-all duration-200'
            onClick={() => {
              setRating(value);
              rate(value);
            }}
            aria-label={
              !rating
                ? `Rate ${value} star${value > 1 ? 's' : ''}`
                : `Rated ${value} star${value > 1 ? 's' : ''}`
            }
          />
        );
      })}
    </div>
  );
}
