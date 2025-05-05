'use client';
import { DEEZER_SEARCH_DATA, DEEZER_SEARCH_RESPONSE } from '@/types';
import { ImageComponent } from '@/components/ui/Image';
import { Suspense } from 'react';
import {
  SaveInteraction,
  RatingInteraction,
  FavoriteInteraction,
} from '@/components/categories/interactions';
import Link from 'next/link';

type Props = {
  data: DEEZER_SEARCH_DATA;
  userId: string | undefined;
};

export function Result({ data, userId }: Readonly<Props>) {
  const {
    title,
    artist,
    album: {
      cover_medium,
      title: albumTitle, // renamed to avoid conflict with the title
    },
    link,
  } = data;

  const ID = link.split('/').pop();

  return (
    <li className='flex flex-col gap-2 p-4 border-b border-white/20 last:border-b-0 hover:bg-zinc-900/5 rounded-md transition-all duration-200 relative'>
      <div className='flex items-center flex-row gap-2 z-10'>
        <ImageComponent
          src={cover_medium}
          alt={albumTitle}
          width={50}
          height={50}
          className='rounded-md'
        />
        <Link
          href={`/track/${ID}`}
          className='focus:underline transition hover:text-blue-300/75'
        >
          <p>{title}</p>
        </Link>
      </div>
      <div className='flex flex-col gap-1'>
        <p className='text-sm text-gray-400'>
          {artist.name} - {albumTitle}
        </p>
      </div>
      {userId && (
        <section className='absolute bg-zinc-900/5 rounded-md transiton duration-200 right-0 top-0 w-full h-full flex items-center justify-center'>
          <div className='flex flex-col gap-2 w-full relative'>
            <div className='flex items-center justify-end gap-2 p-2 w-full mr-5'>
              <SaveInteraction trackId={ID as string} userId={userId} />
              <FavoriteInteraction trackId={ID as string} userId={userId} />
            </div>
            <Suspense>
              <RatingInteraction userId={userId} trackId={ID as string} />
            </Suspense>
          </div>
        </section>
      )}
    </li>
  );
}

export function Results({
  data,
  userId,
}: Readonly<{
  data: DEEZER_SEARCH_RESPONSE;
  userId: string | undefined;
}>) {
  return (
    <ul className='flex flex-col gap-6 xl:gap-8 relative top-20 overflow-y-scroll pb-40 h-full'>
      {data.data.map((item: DEEZER_SEARCH_DATA) => (
        <Result key={item.id} data={item} userId={userId} />
      ))}
    </ul>
  );
}
