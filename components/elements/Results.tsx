'use client';
import { DEEZER_SEARCH_DATA, DEEZER_SEARCH_RESPONSE } from '@/types/api';
import { ImageComponent } from '@/components/ui/Image';
import {
  BASE_URL,
  ICONS,
} from '@/utils/constants';
import { useSession } from '@/contexts/session';
import { useEffect, useCallback } from 'react';
import axios from "axios";
import { EInteraction, EInteractionData } from "@prisma/client";

type Props = {
  data: DEEZER_SEARCH_DATA;
  sessionId: string;
  userId?: string;
};

export function Result({ data, sessionId, userId }: Props) {
  const {
    title,
    artist,
    album: {
      cover_small,
      title: albumTitle, // renamed to avoid conflict with the title
    },
  } = data;

  const { setSessionId, setUserId, sessionId: seshId, userId: uId } = useSession();

  useEffect(() => {
    if (seshId !== sessionId) {
      setSessionId(sessionId);
    }
    if (userId !== undefined && uId !== userId) {
      setUserId(userId);
    }
  }, [sessionId, userId, seshId, uId]);

  const interactionData: Partial<EInteractionData> = {
    title,
    artistName: artist.name,
    albumName: albumTitle,
    imageUrl: cover_small,
    albumId: String(data.album.id),
  }

  const handleSave = useCallback(async () => {
    const response = await axios.post<{
      interaction: EInteraction;
      error?: string;
    }>(`${BASE_URL}/api/interaction`, {
      dataType: "ALBUM",
      interactionType: "SAVED",
      userId: userId,
      sessionId: sessionId,
      interactionData: JSON.parse(JSON.stringify(interactionData)),
    });

    const { interaction, error } = response.data;

    if (error) {
      console.error('Error saving interaction:', error);
      alert('Failed to save interaction');
    }

    if (interaction) {
      alert('Interaction saved successfully');
    }
  }, [data, sessionId, userId]);

  const handleFavorite = useCallback(async () => {
    const response = await axios.post<{
      interaction: EInteraction;
      error?: string;
    }>(`${BASE_URL}/api/interaction`, {
      dataType: "ALBUM",
      interactionType: "FAVORITED",
      userId: userId,
      sessionId: sessionId,
      interactionData: JSON.parse(JSON.stringify(interactionData)),
    });

    const { interaction, error } = response.data;

    if (error) {
      console.error('Error saving interaction:', error);
      alert('Failed to save interaction');
    }

    if (interaction) {
      alert('Interaction saved successfully');
    }
  }, [data, sessionId, userId]);

  return (
    <li className='flex flex-col gap-2 p-4 border-b border-white/20 last:border-b-0 relative hover:bg-zinc-900/5 rounded-md transition-all duration-200'>
      <div className='flex items-center gap-2'>
        <ImageComponent
          src={cover_small}
          alt={albumTitle}
          width={50}
          height={50}
          className='rounded-md'
        />
        <h4>{title}</h4>
      </div>
      <div className='flex flex-col gap-1'>
        <p className='text-sm text-gray-400'>
          {artist.name} - {albumTitle}
        </p>
      </div>
      {
        userId && (
          <section className='absolute bg-zinc-900/5 rounded-md transition-opacity duration-200 right-0 top-0 w-full h-full flex items-center justify-center'>
            <div className='flex items-center justify-end gap-2 p-2 w-full *:hover:text-gray-300 *:focus:text-blue-400 mr-5'>
              <button role='button' title='Save to Library' onClick={handleSave}>
                <ICONS.save />{' '}
                <span className='sr-only'>
                  Save {title} by {artist.name} to your library
                </span>
              </button>
              <button role='button' title='Add to Favorites' onClick={handleFavorite}>
                <ICONS.favorite />{' '}
                <span className='sr-only'>
                  Add {title} by {artist.name} to your favorites
                </span>
              </button>
            </div>
          </section>
        )
      }
    </li>
  );
}

export function Results({ data, sessionId, userId }: { data: DEEZER_SEARCH_RESPONSE; sessionId: string; userId?: string | undefined }) {
  return (
    <ul className='flex flex-col gap-6 xl:gap-8 relative top-20 overflow-y-scroll pb-40 h-full'>
      {data.data.map((item: DEEZER_SEARCH_DATA) => (
        <Result key={item.id} data={item} sessionId={sessionId} userId={userId} />
      ))}
    </ul>
  );
}
