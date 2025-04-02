import Skeleton from "@/components/ui/Skeleton";
import { StringOrUndefined } from "@/types/misc";
import { ICONS } from "@/utils/constants";
import { EDataType, EInteractionType } from "@prisma/client";
import { Link } from "lucide-react";
import ImageComponent from "next/image";
import { FeedUser } from "./User";

export function FeedUserContainer({ children }: { children: React.ReactNode }) {

  return <div className="flex items-center justify-center bg-gray-950/30 px-4 py-2 rounded-xl gap-2 border border-gray-300/20 shadow">
    {children}
  </div>
}

export function FeedItemContainer({ createdAt, userId, imageUrl, title, albumId, albumName, dataId, dataType, interactionType }: { createdAt: Date, userId: string | null, imageUrl: StringOrUndefined, title: StringOrUndefined, albumId: StringOrUndefined, albumName: StringOrUndefined, dataId: StringOrUndefined, dataType: EDataType, rating?: number | null, review?: string | null, interactionType: EInteractionType }) {

  const isToday = new Date(createdAt).toLocaleDateString("en-US") === new Date().toLocaleDateString("en-US");
  const isSameYear = new Date(createdAt).getFullYear() === new Date().getFullYear();

  const interactionTypeIcon = () => {
    switch (interactionType) {
      case "FAVORITED":
        return ICONS.favorite;
      default:
        return ICONS.save;
    }
  }

  const Icon = interactionTypeIcon();


  return (
    <div className="flex items-center justify-start gap-2 w-fit relative pb-8 border-l-4 pl-6 border-white/15 rounded-l-sm bg-gray-900/20 px-10 py-4 shadow-2xl drop-shadow-md mx-2">
      <div className="flex flex-col items-start justify-center w-full gap-4">
        <div className="flex flex-col items-center justify-start w-fit gap-5">
          <div className="flex items-center justify-start gap-4 w-full flex-col md:flex-row">
            <FeedUserContainer>
              <Icon className="h-7 w-7 lg:h-9 lg:w-9 text-blue-400/70 rounded-full shadow" />
              {
                userId && (
                  <FeedUser userId={userId} />
                )
              }
            </FeedUserContainer>
            <div className="flex items-start justify-center gap-2 h-full">
              <span className="text-xs md:text-sm text-gray-400">
                {
                  isToday ? "Today" : new Date(createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                  })
                }
                {isSameYear ? "" : ", " + new Date(createdAt).getFullYear()}
              </span>
              <span className="text-xs 2xl:text-sm text-gray-400">
                {new Date(createdAt).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <Link href={`/album/${albumId}`} className="flex items-center justify-start gap-2 w-full focus:text-blue-400 transition">
              {
                imageUrl && title ? (
                  <ImageComponent src={imageUrl} alt={title} className="w-14 h-14 rounded-md" />
                ) : (
                  <Skeleton className="w-14 h-14 rounded-md" />
                )
              }
              <div className="flex flex-col gap-1 w-full">
                <h5 className="font-bold hover:underline underline-offset-2">{title}</h5>
                <span className="text-sm text-gray-400">
                  {albumName}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute bottom-2 right-2 ml-4">
        <Link href={`/feed/${dataId}`}>
          <ICONS.link className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-gray-400 hover:text-blue-400 transition" />
        </Link>
      </div>
    </div>
  )
}
