import { db } from '@/lib/db';
import { BASE_URL } from '@/utils';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const albums = await db.eAlbum.findMany();
  const users = await db.eUser.findMany();

  const albumsMapped = albums.map((album) => ({
    url: `${BASE_URL}/album/${album.albumId}`,
    lastModified: new Date(album.updatedAt),
    images: [album.imageUrl ? album.imageUrl : ''],
  }));

  const usersMapped = users.map((user) => ({
    url: `${BASE_URL}/profile/${user.userId}`,
    lastModified: new Date(user.updatedAt),
    images: [user.avatar ? user.avatar : ''],
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
  ];
}
