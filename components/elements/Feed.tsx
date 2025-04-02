import { db } from "@/lib/db";
import { EData, EDataType, EInteraction, EInteractionData, EInteractionType } from "@prisma/client";
import { ImageComponent } from "../ui/Image";
import { ICONS } from "@/utils/constants";
import Skeleton from "../ui/Skeleton";
import Link from "next/link";
import { getUserBySessionId } from "@/handlers/user";
import { StringOrUndefined } from "@/types/misc";

interface FeedItemProps {
  interaction: EInteraction;
  data: EData;
  interactionData: EInteractionData;
  userId: string | null;
}

export async function FeedItem({
  interaction,
  data,
  interactionData,
  userId,
}: FeedItemProps) {
  const { createdAt, interactionType } = interaction;
  const { imageUrl, title, albumId, artistName, albumName, dataId, rating, review } = interactionData;
  const { dataType, sessionId } = data;

  const user = await getUserBySessionId(sessionId);

  switch (interactionType) {
    case "FAVORITED":
      return (
        <>
          <FeedItemContainer
            interactionType="FAVORITED"
            dataType={dataType}
            createdAt={createdAt}
            userId={user ? user.userId : null}
            imageUrl={imageUrl && imageUrl !== "undefined" ? imageUrl : undefined}
            title={title && title !== "undefined" ? title : undefined}
            albumId={albumId && albumId !== "undefined" ? albumId : undefined}
            albumName={albumName && albumName !== "undefined" ? albumName : undefined}
            dataId={dataId}
          />
          <span className="sr-only">
            {user ? user.username : "Unknown User"} favorited{" "}
            {title && title !== "undefined" ? title : "Unknown Title"} by{" "}
            {artistName && artistName !== "undefined" ? artistName : "Unknown Artist"}
          </span>
        </>
      );

    case "SAVED":
      return (
        <>
          <FeedItemContainer
            interactionType="SAVED"
            dataType={dataType}
            createdAt={createdAt}
            userId={user ? user.userId : null}
            imageUrl={imageUrl && imageUrl !== "undefined" ? imageUrl : undefined}
            title={title && title !== "undefined" ? title : undefined}
            albumId={albumId && albumId !== "undefined" ? albumId : undefined}
            albumName={albumName && albumName !== "undefined" ? albumName : undefined}
            dataId={dataId}
          />
          <span className="sr-only">
            {user ? user.username : "Unknown User"} saved{" "}
            {title && title !== "undefined" ? title : "Unknown Title"} by{" "}
            {artistName && artistName !== "undefined" ? artistName : "Unknown Artist"}
          </span>
        </>
      );
  }

}

export async function FeedUser({ userId }: { userId: string }) {
  const user = await db.eUser.findFirst({
    where: {
      userId: userId,
    }
  });

  if (user) {
    const { username, avatar } = user;

    return (
      <div className="w-fit h-fit flex items-center justify-start flex-col gap-2">
        <Link href={`/profile/${userId}`} className="flex flex-col md:flex-row items-center justify-start gap-2 focus:text-blue-400 transition">
          {
            avatar && (
              <ImageComponent src={avatar} alt={username} className="w-10 h-10 rounded-full" />
            )
          }
          <h5 className="text-sm lg:text-base hover:underline transition underline-offset-2">{username}</h5>
        </Link>
      </div>
    )
  }

  return (
    <Skeleton className="w-20 h-20 rounded-full" />
  )
}

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
