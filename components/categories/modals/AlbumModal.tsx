"use client";
import { DialogProps, Dialog, ImageComponent } from '@/components/ui';
import Link from 'next/link';
import { Suspense } from 'react';
import { Interact } from '../interactions';
import { useInteractions, useSession } from '@/contexts';

interface AlbumModalProps extends DialogProps {
  albumId: string | null;
  trackId: string | null;
  title: string;
  description?: string;
  albumName: string | null;
  imageUrl: string | null;
  artistName: string | null;
}

export function AlbumModal({
  onClose,
  open,
  albumId,
  title,
  description,
  albumName,
  imageUrl,
  artistName,
  trackId,
}: Readonly<AlbumModalProps>) {

  const { userId } = useSession();

  const { getInteractions } = useInteractions();
  const initialInteractions = getInteractions() ?? [];

  return (
    <Suspense>
      <Dialog
        open={open}
        onClose={onClose}
        title={title}
        description={description}
      >
        <div className='flex flex-col items-center justify-center p-4'>
          {imageUrl && (
            <ImageComponent
              crossOrigin='anonymous'
              src={imageUrl}
              alt={albumName ?? 'Album Image'}
              className='rounded-lg mb-2'
              width={200}
              height={200}
            />
          )}
          <div className='flex flex-col items-center justify-center my-2 gap-4'>
            <Link href={`/track/${trackId}`} className='hover:underline hover:text-gray-300 focus:underline-offset-2 transition-all duration-200 ease-in'>
              <h2>
                {title}
              </h2>
            </Link>
            <h4 className='text-xl font-semibold text-gray-300'>{albumName}</h4>
          </div>
          <p className='text-gray-600'>{artistName}</p>
        </div>
        <div className='flex justify-center flex-col items-center p-4'>
          {
            trackId && userId && (
              <Interact
                trackId={trackId}
                userId={userId}
                initialInteractions={initialInteractions}
              />
            )
          }
        </div>
      </Dialog>
    </Suspense>
  );
}
