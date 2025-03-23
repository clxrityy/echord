import { DEEZER_SEARCH_DATA, DEEZER_SEARCH_RESPONSE } from "@/types/api"
import { ImageComponent } from "../ui/Image";

type Props = {
  data: DEEZER_SEARCH_DATA
}

export function Result({ data }: Props) {

  const {
    title,
    artist,
    album: {
      cover_small,
      title: albumTitle, // renamed to avoid conflict with the title
    },
  } = data;

  return (
    <li className="flex flex-col gap-2 p-4 border-b border-white/20 last:border-b-0">
      <div className="flex items-center gap-2">
        <ImageComponent src={cover_small} alt={albumTitle} width={50} height={50} className="rounded-md" />
        <h4>
          {title}
        </h4>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm text-gray-400">{artist.name} - {albumTitle}</p>
      </div>
    </li>
  )
}

export function Results({ data }: { data: DEEZER_SEARCH_RESPONSE }) {
  return (
    <ul className="flex flex-col gap-6 xl:gap-8 relative overflow-y-scroll max-h-[calc(100vh-10rem)] top-20">
      {data.data.map((item: DEEZER_SEARCH_DATA) => (
        <Result key={item.id} data={item} />
      ))}
    </ul>
  )
}
