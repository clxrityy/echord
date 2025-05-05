'use client';
import {
  // EData,
  EInteraction,
  EInteractionData,
  EInteractionType,
} from '@/prisma/app/generated/prisma/client';
import { FeedItemContainer } from './Containers';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui';
import { FeedListItemSkeleton } from './FeedList';

interface FeedItemProps {
  interaction: EInteraction;
  // data: EData;
  interactionData: EInteractionData;
  userId: string | null;
  username: string | null;
}

export function FeedItem({
  interaction,
  interactionData,
  userId,
  username,
}: Readonly<FeedItemProps>) {
  const {
    createdAt,
    interactionType,
    userId: interactionUserId,
    id: interactionId,
  } = interaction;
  const {
    imageUrl,
    title,
    albumId,
    artistName,
    albumName,
    dataId,
    trackId,
    rating,
  } = interactionData;

  const isCurrentUser = userId == interactionUserId;

  const renderFeedItem = (type: EInteractionType, extraProps: Record<string, any> = {}) => (
    <Suspense fallback={<Skeleton className='w-[5rem] h-full rounded-md' />}>
      <FeedItemContainer
        trackId={trackId ?? ''}
        interactionId={interactionId}
        interactionUserId={interactionUserId}
        isCurrentUser={isCurrentUser}
        interactionType={type}
        createdAt={createdAt}
        userId={userId ?? undefined}
        imageUrl={imageUrl && imageUrl !== 'undefined' ? imageUrl : undefined}
        title={title && title !== 'undefined' ? title : undefined}
        albumId={albumId && albumId !== 'undefined' ? albumId : undefined}
        albumName={albumName && albumName !== 'undefined' ? albumName : undefined}
        dataId={dataId}
        {...extraProps}
      />
      <span className='sr-only'>
        {username ?? 'Unknown User'} {type.toLowerCase()}{' '}
        {title && title !== 'undefined' ? title : 'Unknown Title'} by{' '}
        {artistName && artistName !== 'undefined' ? artistName : 'Unknown Artist'}
        {type === 'RATED' && ` ${rating} stars`}
      </span>
    </Suspense>
  );

  switch (interactionType) {
    case 'FAVORITED':
      return renderFeedItem('FAVORITED');
    case 'SAVED':
      return renderFeedItem('SAVED');
    case 'RATED':
      return renderFeedItem('RATED', { rating: rating ?? 0 });
    default:
      return <FeedListItemSkeleton />;
  }
}
