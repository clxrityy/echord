import { DEEZER_TRACK_DATA } from '@/types';
import { DEEZER_API_URL } from '@/utils';

export async function getTrack(id: string) {
  const response = await fetch(`${DEEZER_API_URL}/track/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const trackData = (await response.json()) as DEEZER_TRACK_DATA;

  if (!trackData) {
    return null;
  }

  return trackData;
}
