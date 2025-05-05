'use client';

import { Button } from '@/components/ui';
import { useInteractions } from '@/contexts';
import { Interaction } from '@/types';
import { ICONS } from '@/util';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export function SaveInteraction({
  userId,
  trackId,
}: Readonly<{
  userId: string;
  trackId: string;
}>) {
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
    }

    setLoading(false);
  }, [interactions, trackId, userId]);

  useEffect(() => {
    checkSaved();
  }, [loading, interactions, saved, trackId, userId]);

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
        toast.error(`Failed to save track: ${error}`, {
          id: toastId,
        });
      } else {
        toast.success('Saved successfully', {
          id: toastId,
        });
        setSaved(true);
        setLoading(false);
        if (interaction) {
          addInteraction({
            ...interaction,
            interactionType: 'SAVED',
            interactionData: {
              ...interaction.interactionData,
              trackId,
            },
          } as Interaction);
        }
      }
    } catch (error) {
      console.error('Error saving interaction:', error);
      toast.error('Error saving', {
        id: toastId,
      });
    } finally {
      const timeout = setTimeout(() => {
        toast.dismiss(toastId);
      }, 5000);

      clearTimeout(timeout);
      setLoading(false);
    }
  };

  const { loading: IconLoading, save: IconSave } = ICONS;

  return (
    <Button
      title='Save'
      disabled={saved || loading}
      onClick={async () => await handleSave()}
      className={`${loading ? 'cursor-none' : 'disabled:text-green-500/80 hover:text-gray-300 focus:text-blue-400 disabled:hover:text-green-500/80 disabled:cursor-not-allowed transition-all duration-200 ease-in-out z-20'}`}
    >
      {loading ? <IconLoading className='animate-spin' /> : <IconSave />}
      <span className='sr-only'>{saved ? 'Saved' : 'Save to Library'}</span>
    </Button>
  );
}
