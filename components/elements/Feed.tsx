import { db } from "@/lib/db";
import { EData, EInteraction, EInteractionData } from "@prisma/client";
import { ImageComponent } from "../ui/Image";
import { ICONS } from "@/utils/constants";
import Skeleton from "../ui/Skeleton";
import Link from "next/link";
import { getUserBySessionId } from "@/handlers/user";

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
  const { imageUrl, title, albumId, artistName, albumName } = interactionData;
  const { dataType, sessionId } = data;

  const user = await getUserBySessionId(sessionId);

  switch (interactionType) {
    case "FAVORITED":
      return (
        <div className="flex items-center justify-start gap-2 w-full relative border-b pb-5 border-white/15">
          <div className="flex flex-col items-start justify-center w-full">
            <div className="flex flex-col md:flex-row items-center justify-start w-fit gap-5">
              <div className="flex items-center justify-start gap-2 w-full">
                <ICONS.favorite className="h-5 w-5 lg:h-7 lg:w-7" />
                {
                  user && (
                    <FeedUser userId={user.userId} />
                  )
                }
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
            <div className="flex items-end justify-center gap-2 absolute right-0 h-full flex-col">
              <span className="text-xs md:text-sm text-gray-400">
                {new Date(createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="text-xs 2xl:text-sm text-gray-400">
                {new Date(createdAt).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <span className="sr-only">
              {
                user?.username && (
                  user.username + " favorited " + title + " by " + artistName + " from " + albumName
                )
              }
            </span>
          </div>
        </div>
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
