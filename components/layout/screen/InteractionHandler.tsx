'use client';
import { useInteractions } from '@/contexts';
import { useEffect, useState } from 'react';

type Props = {
  userId?: string | undefined;
};

export function InteractionHandler({ userId }: Props) {
  const [loading, setLoading] = useState<boolean>(true);
  const { getInteractions, setInteractions } = useInteractions();

  const interactions = getInteractions();

  useEffect(() => {
    const fetchInteractions = async () => {
      try {
        const res = await fetch(`/api/user/interactions?userId=${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const { interactions: data } = await res.json();

        if (res.status === 200) {
          setInteractions(data);
        } else {
          return;
        }
      } catch (error) {
        console.error('Error fetching interactions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (loading) {
      fetchInteractions();
    }
  }, [userId, interactions]);

  return <></>;
}
