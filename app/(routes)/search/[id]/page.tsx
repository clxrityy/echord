import { Results } from "@/components/elements/Results";
import { DEEZER_API_URL } from "@/lib/config";
import { DEEZER_SEARCH_RESPONSE } from "@/types/api";
import axios from "axios";

type Props = {
  params: Promise<{
    id: string;
  }>
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

  return (
    <div className='search-page'>
      <h1>Search Results for: {id}</h1>
      {/* Add your search results component here */}
      <Results data={await fetchSearchResults()} />
    </div>
  );
}
