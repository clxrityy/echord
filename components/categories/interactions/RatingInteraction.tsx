'use client';
import { useInteractions } from '@/contexts';
import { ICONS } from '@/util';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export function RatingInteraction({
  trackId,
  userId,
}: Readonly<{
  trackId: string;
  userId: string;
}>) {
  const [rating, setRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<number | null>(null);

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
    if (rating === null) {
      checkRating();
    }
  }, [interactions, isLoading, trackId, userId, isLoading]);

  const rate = async (value: number) => {
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
      const { interaction, error } = await response.json();

      if (error) {
        toast.error(error, { id: toastId });
        return;
      }

      addInteraction(interaction);
      setRating(value);
      toast.success('Rated successfully', { id: toastId });
      
    } catch (err) {
      console.error('Error rating:', err);
      toast.error('Failed to rate', { id: toastId });
    } finally {
      setTimeout(() => {
        setIsHovered(null);
        toast.dismiss(toastId);
      }, 1000);
    }
  };

  const determineColor = useCallback(
    (value: number) => {
      if (rating) {
        if (value <= rating) {
          return 'yellow';
        } else {
          return 'gray';
        }
      } else if (value <= isHovered!) {
          return 'yellow';
        } else {
          return 'gray';
        }
    },
    [rating, isHovered]
  );

  const { loading: IconLoading, star: IconStar } = ICONS;

  const ariaLabel = (value: number) => {
    const starText = `star${value > 1 ? 's' : ''}`;
    return !rating ? `Rate ${value} ${starText}` : `Rated ${value} ${starText}`;
  };

  return (
    <div className='flex items-center gap-1 justify-end w-full'>
      {[1, 2, 3, 4, 5].map((value, idx) => {
        return isLoading ? (
          <IconLoading key={value} className='animate-spin' />
        ) : (
          <IconStar
            onMouseOver={(e) => {
              e.preventDefault();
              setIsHovered(value);
            }}
            onMouseLeave={(e) => {
              e.preventDefault();
              setIsHovered(null);
            }}
            key={idx + value}
            color={determineColor(rating ?? value)}
            className='cursor-pointer transition-all duration-200'
            onClick={() => {
              setRating(value);
              rate(value);
            }}
            aria-label={ariaLabel(value)}
          />
        );
      })}
    </div>
  );
}
