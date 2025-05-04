import { db } from '@/lib/db';
import { BASE_URL } from '@/util';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const albums = await db.eAlbum.findMany();
  const users = await db.eUser.findMany();
  const tracks = await db.eTrack.findMany();

  const albumsMapped = albums.map((album) => ({
    url: `${BASE_URL}/album/${album.albumId}`,
    lastModified: new Date(album.updatedAt),
    images: [album.imageUrl ?? ''],
  }));

  const usersMapped = users.map((user) => ({
    url: `${BASE_URL}/profile/${user.userId}`,
    lastModified: new Date(user.updatedAt),
    images: [user.avatar ?? ''],
  }));

  const tracksMapped = tracks.map((track) => ({
    url: `${BASE_URL}/track/${track.trackId}`,
    lastModified: new Date(track.updatedAt),
    images: [track.imageUrl ?? ''],
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1,
    },
    ...albumsMapped,
    ...usersMapped,
    ...tracksMapped,
  ];
}
