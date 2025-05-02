'use client';
import { Skeleton, Button, Tooltip } from '@/components/ui';
import { StringOrUndefined } from '@/types';
import { BASE_URL, ICONS } from '@/utils';
import { EInteractionType } from '@/prisma/app/generated/prisma/client';
import Link from 'next/link';
import ImageComponent from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FeedUser } from './User';
import { ReactNode, Suspense, useCallback, useState } from 'react';
import { InteractionModal } from '../modals';

export function FeedUserContainer({ children }: { children: ReactNode }) {
  return (
    <div className='flex items-center justify-center bg-gray-950/30 px-4 py-2 rounded-xl gap-2 border border-gray-300/20 shadow'>
      {children}
    </div>
  );
}

export interface FeedItemContainerProps {
  createdAt: Date;
  userId: StringOrUndefined;
  imageUrl: StringOrUndefined;
  title: StringOrUndefined;
  albumId: StringOrUndefined;
  albumName: StringOrUndefined;
  dataId: string;
  interactionType: EInteractionType;
  isCurrentUser: boolean;
  interactionUserId: StringOrUndefined;
  interactionId: string;
  rating?: number;
  trackId: string;
}

export function FeedItemContainer({
  createdAt,
  userId,
  imageUrl,
  title,
  // albumId,
  trackId,
  albumName,
  dataId,
  // dataType,
  interactionType,
  isCurrentUser,
  interactionUserId,
  interactionId,
  rating,
}: FeedItemContainerProps) {
  const isToday =
    new Date(createdAt).toLocaleDateString('en-US') ===
    new Date().toLocaleDateString('en-US');
  const isSameYear =
    new Date(createdAt).getFullYear() === new Date().getFullYear();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const interactionTypeIcon = () => {
    switch (interactionType) {
      case 'FAVORITED':
        return ICONS.favorite;
      case 'SAVED':
        return ICONS.save;
      case 'RATED':
        return ICONS.star;
      default:
        return ICONS.loading;
    }
  };

  const deleteInteractionToolTipText = () => {
    switch (interactionType) {
      case 'FAVORITED':
        return 'Unfavorite';
      case 'SAVED':
        return 'Unsave';
      case 'RATED':
        return 'Unrate';
      case 'REVIEWED':
        return 'Unreview';
      case 'FOLLOWED':
        return 'Unfollow';
      default:
        return 'Delete';
    }
  };

  const interactionToolTipText = () => {
    switch (interactionType) {
      case 'FAVORITED':
        return `Favorited`;
      case 'SAVED':
        return `Saved`;
      case 'RATED':
        return `Rated ${rating}/5`;
      case 'REVIEWED':
        return `Reviewed`;
      default:
        return `Interacted`;
    }
  };

  const router = useRouter();

  const Icon = interactionTypeIcon();

  async function handleDelete() {
    const toastId = toast.loading('Deleting interaction...');

    if (!userId) {
      toast.error('User not found', { id: toastId });
      return;
    }

    try {
      const { message, error } = await fetch(
        `${BASE_URL}/api/interaction?userId=${userId}&interactionId=${dataId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      ).then((res) => res.json());

      if (message) {
        toast.success(message, {
          id: toastId,
        });
        router.refresh();
        return;
      } else if (error) {
        toast.error(error, {
          id: toastId,
        });
      }

      // Handle successful deletion
      toast.success('Interaction deleted successfully', {
        icon: <ICONS.trash />,
        id: toastId,
      });
      router.refresh();
    } catch (e) {
      console.error('Error deleting interaction:', e);
      toast.error('Failed to delete interaction', {
        id: toastId,
      });
    } finally {
      const timeout = setTimeout(() => {
        toast.dismiss(toastId);
      }, 5000);
      clearTimeout(timeout);
    }
  }

  return (
    <>
      <div className='flex items-start justify-start lg:justify-center 2xl:justify-start gap-2 w-full sm:w-2/3 md:w-1/2 lg:w-[90%] xl:w-full relative pb-8 border-l-4 pl-6 border-white/25 rounded-l-sm bg-[var(--color-blue-pastelic-pale)]/[4.25%] px-10 py-4 shadow-2xl drop-shadow-sm drop-shadow-gray-600/30 mx-2'>
        <div className='flex flex-col items-start justify-center w-full gap-4'>
          <div className='flex flex-col items-center justify-start w-fit gap-5'>
            <div className='flex items-start justify-start gap-4 w-full flex-col md:flex-row relative'>
              <FeedUserContainer>
                <Suspense
                  fallback={
                    <Skeleton className='w-8 h-8 rounded-4xl animate-pulse bg-zinc-400/65' />
                  }
                >
                  <Tooltip text={interactionToolTipText()}>
                    <div className='flex items-center justify-center gap-2'>
                      <Icon
                        className='rounded-xl shadow text-gray-200/90 cursor-pointer'
                        aria-label={interactionType}
                      />
                      {rating && (
                        <span className='text-xs md:text-sm 2xl:text-base font-extrabold'>
                          {rating}
                        </span>
                      )}
                    </div>
                  </Tooltip>
                </Suspense>
                {interactionUserId && (
                  <Suspense
                    fallback={
                      <Skeleton className='w-[6px] rounded-4xl animate-pulse bg-zinc-400/65' />
                    }
                  >
                    <FeedUser userId={interactionUserId} />
                  </Suspense>
                )}
              </FeedUserContainer>
              <div className='flex items-center lg:items-start justify-center gap-2 h-full xl:flex-col 2xl:flex-row'>
                <span className='text-xs md:text-sm text-gray-400'>
                  {isToday
                    ? 'Today'
                    : new Date(createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: '2-digit',
                      })}
                  {isSameYear ? '' : ', ' + new Date(createdAt).getFullYear()}
                </span>
                <span className='text-xs 2xl:text-sm text-gray-400'>
                  {new Date(createdAt).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
            <div className='flex flex-col gap-2 w-full'>
              <Link
                href={`/track/${trackId}`}
                className='flex items-center justify-start gap-2 w-full focus:text-blue-400 transition'
              >
                {imageUrl && title ? (
                  <ImageComponent
                    src={imageUrl}
                    alt={title}
                    className='w-14 h-14 rounded-md'
                    width={25}
                    height={25}
                  />
                ) : (
                  <Skeleton className='w-14 h-14 rounded-md' />
                )}
                <div className='flex flex-col gap-1 w-full'>
                  <h5 className='font-bold hover:underline underline-offset-2'>
                    {title}
                  </h5>
                  <span className='text-sm text-gray-400'>{albumName}</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
        <div className='absolute flex flex-col items-end right-0 h-full'>
          <div className='absolute bottom-5 right-2 ml-4'>
            <Button
              onClick={() => setIsOpen((prev) => !prev)}
              className='h-4 w-4 md:h-5 md:w-5 2xl:h-6 2xl:w-6 text-gray-300/90 hover:text-purple-300/90 focus:text-purple-400/80 focus:scale-105 duration-100 transition-all ease-in-out'
            >
              <ICONS.link className='' />
            </Button>
          </div>
          <div className='asbolute top-0 right-2 ml-4 px-2'>
            {isCurrentUser && (
              <Tooltip text={`${deleteInteractionToolTipText()}`}>
                <Button
                  type='button'
                  title='delete'
                  className='text-gray-300/90 hover:text-red-400 focus:text-red-500 focus:ring focus:ring-offset-0 focus:ring-red-400/25 focus:ring-offset-white/5 rounded-2xl transition-colors ease-in-out px-1 py-1'
                  onClick={async () => await handleDelete()}
                >
                  <ICONS.trash className='h-4 w-4 md:h-5 md:w-5 4xl:h-6 4xl:w-6' />
                </Button>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
      <div className='absolute'>
        <InteractionModal
          onClose={handleClose}
          open={isOpen}
          title={title ?? ''}
          interactionId={interactionId}
        />
      </div>
    </>
  );
}
