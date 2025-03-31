import { ImageComponent } from "@/components/ui/Image";
import { ICONS } from "@/utils/constants";
import { EInteractionData } from "@prisma/client";

interface FavoritesProps {
  interactionData: Partial<EInteractionData>[] | EInteractionData[];
}

export const Favorites = ({ interactionData }: FavoritesProps) => {

  return (
    <div className="flex flex-col items-center justify-center w-full gap-2">
      <h1 className="text-2xl font-bold mb-4 flex flex-row gap-2 items-center">
        Favorites <ICONS.favorite />
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border border-white/20 rounded-lg p-4">
        {interactionData.map((data) => (
          <div key={data.id} className="shadow-md rounded-lg p-4 flex flex-col items-center">
            {
              data.imageUrl && data.albumName && (
                <ImageComponent
                  src={data.imageUrl}
                  alt={data.albumName}
                  width={50}
                  height={50}
                  className="rounded-lg mb-2"
                />
              )
            }
            <h4 className="text-xl font-semibold mt-2">{data.title}</h4>
            <p className="text-gray-600">{data.artistName}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
