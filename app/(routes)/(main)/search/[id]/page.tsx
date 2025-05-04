import { Skeleton } from '@/components/ui';
import { BASE_URL, DEEZER_API_URL } from '@/util';
import { DEEZER_SEARCH_RESPONSE } from '@/types';
import { Suspense } from 'react';
import './index.css';
import { connection } from 'next/server';
import { Window } from '@/components/layout';
import Loading from '@/app/loading';
import { getUserSessionId } from '@/lib';
import { getUserBySessionId } from '@/app/_actions';
import { Results } from '@/components/categories/data';
import { Metadata } from 'next';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = 'force-dynamic'; // Force dynamic rendering

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;

  return {
    title: `Search results for ${id}`,
    description: `Search results for ${id} on Echord`,
    openGraph: {
      title: `Search results for ${id}`,
      description: `Search results for ${id} on Echord`,
      url: `${BASE_URL}/search/${id}`,
      siteName: 'Echord',
    },
  };
}

export default async function SearchPage({ params }: Props) {
  await connection();

  const id = (await params).id;

  async function fetchSearchResults(): Promise<DEEZER_SEARCH_RESPONSE> {
    const response = await fetch(`${DEEZER_API_URL}/search?q=${id}`);

    if (response.status !== 200) {
      throw new Error('Failed to fetch search results');
    }

    return (await response.json()) as DEEZER_SEARCH_RESPONSE;
  }

  const data = await fetchSearchResults();

  const sessionId = await getUserSessionId();
  const user = await getUserBySessionId(sessionId || '');

  const length = data.data.length;

  if (length === 0) {
    return (
      <div className='search-page'>
        <h1 className='top-10'>
          No results found for:{' '}
          <span className='italic'>&ldquo;{id}&ldquo;</span>
        </h1>
      </div>
    );
  }

  return (
    <Suspense fallback={<Loading />}>
      <Window sessionId={sessionId || ''}>
        <div className='search-page'>
          <h1 className='fixed top-6 flex gap-3 items-center'>
            Search Results for:{' '}
            <span className='italic font-medium'>{decodeURIComponent(id)}</span>
          </h1>
          <Suspense fallback={<Skeleton />}>
            <Results data={data} userId={user?.userId} />
          </Suspense>
        </div>
      </Window>
    </Suspense>
  );
}
