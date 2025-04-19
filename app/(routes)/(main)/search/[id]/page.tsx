import { Results } from '@/components/elements/data/Results';
import Skeleton from '@/components/ui/Skeleton';
import { DEEZER_API_URL } from '@/utils';
import { DEEZER_SEARCH_RESPONSE } from '@/types';
import axios from 'axios';
import { Suspense } from 'react';
import { handleCurrentSession } from '@/app/_actions/session';
import './index.css';
import { connection } from 'next/server';
import { Window } from '@/components/layout/screen/Window';
import Loading from '@/app/loading';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SearchPage({ params }: Props) {
  await connection();

  const id = (await params).id;

  async function fetchSearchResults(): Promise<DEEZER_SEARCH_RESPONSE> {
    const response = await axios.get(`${DEEZER_API_URL}/search?q=${id}`);

    if (response.status !== 200) {
      throw new Error('Failed to fetch search results');
    }

    return response.data as DEEZER_SEARCH_RESPONSE;
  }

  const data = await fetchSearchResults();
  const session = await handleCurrentSession();

  const length = data.data.length;

  if (length === 0) {
    return (
      <div className='search-page'>
        <h1>
          No results found for:{' '}
          <span className='italic'>&ldquo;{id}&ldquo;</span>
        </h1>
      </div>
    );
  }

  return (
    <Suspense fallback={<Loading />}>
      <Window sessionId={session.sessionId || ''}>
        <div className='search-page'>
          <h1 className='fixed top-10'>
            Search Results for:{' '}
            <span className='italic'>&ldquo;{id}&ldquo;</span>
          </h1>
          <Suspense fallback={<Skeleton />}>
            {session.userId ? (
              <Results
                data={data}
                sessionId={session.sessionId}
                userId={session.userId}
              />
            ) : (
              <Results data={data} sessionId={session.sessionId} />
            )}
          </Suspense>
        </div>
      </Window>
    </Suspense>
  );
}
