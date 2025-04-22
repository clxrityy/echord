'use client';
import {
  EData,
  EInteraction,
  EInteractionData,
} from '@/prisma/app/generated/prisma/client';
import { FeedItemContainer } from './Containers';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui';
import { FeedListItemSkeleton } from './FeedList';

interface FeedItemProps {
  interaction: EInteraction;
  data: EData;
  interactionData: EInteractionData;
  userId: string | null;
  username: string | null;
}

export function FeedItem({
  interaction,
  data,
  interactionData,
  userId,
  username,
}: FeedItemProps) {
  const { createdAt, interactionType, userId: interactionUserId } = interaction;
  const {
    imageUrl,
    title,
    albumId,
    artistName,
    albumName,
    dataId,
    // rating, review
  } = interactionData;
  const { dataType } = data;

  const isCurrentUser = userId == interactionUserId;

  switch (interactionType) {
    case 'FAVORITED':
      return (
        <Suspense
          fallback={<Skeleton className='w-[5rem] h-full rounded-md' />}
        >
          <FeedItemContainer
            isCurrentUser={isCurrentUser}
            interactionType='FAVORITED'
            dataType={dataType}
            createdAt={createdAt}
            userId={userId ? userId : undefined}
            imageUrl={
              imageUrl && imageUrl !== 'undefined' ? imageUrl : undefined
            }
            title={title && title !== 'undefined' ? title : undefined}
            albumId={albumId && albumId !== 'undefined' ? albumId : undefined}
            albumName={
              albumName && albumName !== 'undefined' ? albumName : undefined
            }
            dataId={dataId}
            interactionUserId={interactionUserId}
          />
          <span className='sr-only'>
            {username ? username : 'Unknown User'} favorited{' '}
            {title && title !== 'undefined' ? title : 'Unknown Title'} by{' '}
            {artistName && artistName !== 'undefined'
              ? artistName
              : 'Unknown Artist'}
          </span>
        </Suspense>
      );

    case 'SAVED':
      return (
        <Suspense
          fallback={<Skeleton className='w-[5rem] h-full rounded-md' />}
        >
          <FeedItemContainer
            interactionUserId={interactionUserId}
            isCurrentUser={isCurrentUser}
            interactionType='SAVED'
            dataType={dataType}
            createdAt={createdAt}
            userId={userId ? userId : undefined}
            imageUrl={
              imageUrl && imageUrl !== 'undefined' ? imageUrl : undefined
            }
            title={title && title !== 'undefined' ? title : undefined}
            albumId={albumId && albumId !== 'undefined' ? albumId : undefined}
            albumName={
              albumName && albumName !== 'undefined' ? albumName : undefined
            }
            dataId={dataId}
          />
          <span className='sr-only'>
            {username ? username : 'Unknown User'} saved{' '}
            {title && title !== 'undefined' ? title : 'Unknown Title'} by{' '}
            {artistName && artistName !== 'undefined'
              ? artistName
              : 'Unknown Artist'}
          </span>
        </Suspense>
      );

    default:
      return <FeedListItemSkeleton />;
  }
}
