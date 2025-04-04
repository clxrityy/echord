import { Results } from '@/components/elements/Results';
import Skeleton from '@/components/ui/Skeleton';
import { DEEZER_API_URL } from '@/utils';
import { DEEZER_SEARCH_RESPONSE } from '@/types';
import axios from 'axios';
import { Suspense } from 'react';
import { handleCurrentSession } from '@/handlers/session';
import "./index.css";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SearchPage({ params }: Props) {
  const id = (await params).id;

  async function fetchSearchResults(): Promise<DEEZER_SEARCH_RESPONSE> {
    const response = await axios.get(`${DEEZER_API_URL}/search?q=${id}&limit=6`);

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
          No results found for: <span className='italic'>&ldquo;{id}&ldquo;</span>
        </h1>
      </div>
    );
  }

  return (
    <div className='search-page'>
      <h1>
        Search Results for: <span className='italic'>&ldquo;{id}&ldquo;</span>
      </h1>
      <Suspense fallback={<Skeleton />}>
        {
          session.userId ? (
            <Results
              data={data}
              sessionId={session.sessionId}
              userId={session.userId}
            />
          ) : (
            <Results data={data} sessionId={session.sessionId} />
          )
        }
      </Suspense>
    </div>
  );
}
