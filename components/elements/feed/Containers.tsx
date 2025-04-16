'use client';
import Skeleton from '@/components/ui/Skeleton';
import { StringOrUndefined } from '@/types';
import { BASE_URL, ICONS } from '@/utils';
import { EDataType, EInteractionType } from '@prisma/client';
import Link from 'next/link';
import ImageComponent from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FeedUser } from './User';
import { ReactNode } from 'react';

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
  dataType: EDataType;
  interactionType: EInteractionType;
  isCurrentUser: boolean;
}

export function FeedItemContainer({
  createdAt,
  userId,
  imageUrl,
  title,
  albumId,
  albumName,
  dataId,
  // dataType,
  interactionType,
  isCurrentUser,
}: FeedItemContainerProps) {
  const isToday =
    new Date(createdAt).toLocaleDateString('en-US') ===
    new Date().toLocaleDateString('en-US');
  const isSameYear =
    new Date(createdAt).getFullYear() === new Date().getFullYear();

  const interactionTypeIcon = () => {
    switch (interactionType) {
      case 'FAVORITED':
        return ICONS.favorite;
      default:
        return ICONS.save;
    }
  };

  const router = useRouter();

  const Icon = interactionTypeIcon();

  async function handleDelete() {
    const toastId = toast.loading('Deleting interaction...');

    try {
      const { status, message, error } = await axios
        .delete(`${BASE_URL}/api/interaction`, {
          data: {
            userId,
            interactionId: dataId,
          },
        })
        .then((res) => res.data);

      if (status !== 200) {
        console.error('Error deleting interaction:', message || error);
        return;
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
      toast.dismiss(toastId);
    }
  }

  return (
    <div className='flex items-start justify-start gap-2 w-full sm:w-2/3 md:w-1/2 lg:w-fit xl:w-full relative pb-8 border-l-4 pl-6 border-white/25 rounded-l-sm bg-[var(--color-blue-pastelic-pale)]/[2%] px-10 py-4 shadow-2xl drop-shadow-sm drop-shadow-gray-600/30 mx-2'>
      <div className='flex flex-col items-start justify-center w-full gap-4'>
        <div className='flex flex-col items-center justify-start w-fit gap-5'>
          <div className='flex items-center justify-start gap-4 w-full flex-col md:flex-row'>
            <FeedUserContainer>
              <Icon className='h-7 w-7 lg:h-9 lg:w-9 text-blue-400/70 rounded-full shadow' />
              {userId && <FeedUser userId={userId} />}
            </FeedUserContainer>
            <div className='flex items-start justify-center gap-2 h-full'>
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
              href={`/album/${albumId}`}
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
          <Link href={`/feed/${dataId}`} target='_blank' prefetch={false}>
            <ICONS.link className='h-4 w-4 md:h-5 md:w-5 2xl:h-6 2xl:w-6 text-gray-300/90 hover:text-purple-400 transition-colors ease-in-out' />
          </Link>
        </div>
        <div className='asbolute top-0 right-0 ml-4 px-2'>
          {isCurrentUser && (
            <button
              type='button'
              title='delete'
              className='text-gray-300/90 hover:text-red-400 focus:text-red-500 focus:ring focus:ring-offset-0 focus:ring-red-400/25 focus:ring-offset-white/5 rounded-2xl transition-colors ease-in-out px-1 py-1'
              onClick={async () => await handleDelete()}
            >
              <ICONS.trash className='h-4 w-4 md:h-5 md:w-5 4xl:h-6 4xl:w-6' />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
