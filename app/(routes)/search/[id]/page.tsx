import { Results } from '@/components/elements/Results';
import Skeleton from '@/components/ui/Skeleton';
import { DEEZER_API_URL } from '@/utils/constants';
import { DEEZER_SEARCH_RESPONSE } from '@/types/api';
import axios from 'axios';
import { Suspense } from 'react';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SearchPage({ params }: Props) {
  const id = (await params).id;

  async function fetchSearchResults(): Promise<DEEZER_SEARCH_RESPONSE> {
    const response = await axios.get(`${DEEZER_API_URL}/search?q=${id}`);

    if (response.status !== 200) {
      throw new Error('Failed to fetch search results');
    }

    return response.data as DEEZER_SEARCH_RESPONSE;
  }

  const data = await fetchSearchResults();

  return (
    <div className='search-page'>
      <h1>
        Search Results for: <span className='italic'>&ldquo;{id}&ldquo;</span>
      </h1>
      <Suspense fallback={<Skeleton />}>
        <Results data={data} />
      </Suspense>
    </div>
  );
}
