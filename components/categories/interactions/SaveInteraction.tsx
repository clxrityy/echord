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
  const [nodeTimeout, setNodeTimeout] = useState<NodeJS.Timeout | null>(null);

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

    return () => {
      if (nodeTimeout) {
        clearTimeout(nodeTimeout);
      }
      setNodeTimeout(null);
    };
  }, [loading, interactions, saved, trackId, userId, checkSaved, nodeTimeout]);

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
      }
      const timeout = setTimeout(() => {
        if (interaction) {
          addInteraction(interaction as Interaction);
          setSaved(true);
          toast.success('Saved successfully', {
            id: toastId,
          });
        } else {
          toast.error('Failed to save', {
            id: toastId,
          });
        }
      }, 1000);
      setNodeTimeout(timeout);
    } catch (error) {
      console.error('Error saving interaction:', error);
      toast.error('Error saving', {
        id: toastId,
      });
    } finally {
      if (nodeTimeout) {
        clearTimeout(nodeTimeout);
      } else {
        const timeout = setTimeout(() => {
          toast.dismiss(toastId);
        }, 1000);
        setNodeTimeout(timeout);
      }
    }
  };

  return (
    <Button
      title='Save'
      disabled={saved || loading}
      onClick={async () => await handleSave()}
      className={`${loading ? 'cursor-none' : 'disabled:text-green-500/80 hover:text-gray-300 focus:text-blue-400 disabled:hover:text-green-500/80 disabled:cursor-not-allowed transition-all duration-200 ease-in-out'}`}
    >
      {loading ? <ICONS.loading className='animate-spin' /> : <ICONS.save />}
      <span className='sr-only'>{saved ? 'Saved' : 'Save to Library'}</span>
    </Button>
  );
}
