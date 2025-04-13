import { EData, EInteraction, EInteractionData } from "@prisma/client";
import { getUserBySessionId } from "@/handlers/user";
import { FeedItemContainer } from "./Containers";
import { Suspense } from "react";
import Skeleton from "@/components/ui/Skeleton";

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
  const { createdAt, interactionType, userId: interactionUserId } = interaction;
  const { imageUrl, title, albumId, artistName, albumName, dataId,
    // rating, review
  } = interactionData;
  const { dataType, sessionId } = data;

  const user = await getUserBySessionId(sessionId);

  const isCurrentUser = userId == interactionUserId;

  switch (interactionType) {
    case "FAVORITED":
      return (
        <Suspense fallback={<Skeleton className="w-[5rem] h-full rounded-md" />}>
          <FeedItemContainer
            isCurrentUser={isCurrentUser}
            interactionType="FAVORITED"
            dataType={dataType}
            createdAt={createdAt}
            userId={user ? user.userId : undefined}
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
        </Suspense>
      );

    case "SAVED":
      return (
        <Suspense fallback={<Skeleton className="w-[5rem] h-full rounded-md" />}>
          <FeedItemContainer
            isCurrentUser={isCurrentUser}
            interactionType="SAVED"
            dataType={dataType}
            createdAt={createdAt}
            userId={user ? user.userId : undefined}
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
        </Suspense>
      );
  }

}
