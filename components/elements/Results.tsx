"use client";
import { DEEZER_SEARCH_DATA, DEEZER_SEARCH_RESPONSE } from "@/types/api"
import { ImageComponent } from "@/components/ui/Image";
import { BASE_URL, ICONS } from "@/lib/config";
import { useCallback } from "react";
import axios from "axios";
import { EInteraction } from "@prisma/client";

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

  const handleSave = useCallback(async () => {
    const response = await axios.post<EInteraction>(`${BASE_URL}/api/interaction`, {
      dataType: "ALBUM",
      interactionType: "SAVE",

    })
  }, []);

  return (
    <li className="flex flex-col gap-2 p-4 border-b border-white/20 last:border-b-0 relative hover:bg-zinc-900/5 backdrop-blur-sm rounded-md transition-all duration-200">
      <div className="flex items-center gap-2">
        <ImageComponent src={cover_small} alt={albumTitle} width={50} height={50} className="rounded-md" />
        <h4>
          {title}
        </h4>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm text-gray-400">{artist.name} - {albumTitle}</p>
      </div>
      <section className="absolute top-0 left-0 w-full h-full bg-zinc-900/5 backdrop-blur-sm rounded-md opacity-0 hover:opacity-100 transition-opacity duration-200">
        <div className="flex items-center justify-center h-full">
          <button>
            <ICONS.save /> <span className="sr-only">
              Save {title} by {artist.name} to your library
            </span>
          </button>
        </div>
      </section>
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
