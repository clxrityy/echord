'use client';

import { Button } from '@/components/ui';
import { useInteractions } from '@/contexts';
import { Interaction } from '@/types';
import { ICONS } from '@/utils';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export function SaveInteraction({
  userId,
  trackId,
}: {
  userId: string;
  trackId: string;
}) {
  const [saved, setSaved] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const { addInteraction, getInteractions } = useInteractions();

  const interactions = getInteractions();

  const checkSaved = useCallback(() => {
    if (interactions) {
      const interaction = interactions.find((interaction) => {
        return (
          interaction?.interactionType === 'SAVED' &&
          interaction.interactionData?.trackId === trackId &&
          interaction.userId === userId
        );
      });

      if (interaction && interaction.interactionData) {
        setSaved(true);
      } else {
        setSaved(false);
      }
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [interactions, trackId, userId]);

  useEffect(() => {
    if (loading && !saved && interactions) {
      checkSaved();
    }
  }, [loading, interactions, saved, trackId, userId, checkSaved]);

  const handleSave = async () => {
    const toastId = toast.loading('Saving...');

    try {
      const response = await fetch('/api/interaction/save', {
        method: 'POST',
        body: JSON.stringify({
          dataId: trackId,
          userId,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { interaction, error } = await response.json();

      if (error) {
        toast.error(`Failed to save interaction: ${error}`, {
          id: toastId,
        });
      }

      if (interaction) {
        addInteraction(interaction as Interaction);
        setSaved(true);
        toast.success('Saved successfully', {
          id: toastId,
        });
      }
    } catch (error) {
      console.error('Error saving interaction:', error);
      toast.error('Error saving', {
        id: toastId,
      });
    }
  };

  return (
    <Button
      title='Save'
      disabled={saved}
      onClick={async () => await handleSave()}
      className='disabled:text-green-500/80 hover:text-gray-300 focus:text-blue-400 disabled:hover:text-green-500/80 disabled:cursor-not-allowed transition-all duration-200 ease-in-out'
    >
      <ICONS.save />
      <span className='sr-only'>{saved ? 'Saved' : 'Save to Library'}</span>
    </Button>
  );
}
