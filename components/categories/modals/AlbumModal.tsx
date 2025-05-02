import { DialogProps, Dialog, ImageComponent } from '@/components/ui';
import { Suspense } from 'react';

interface AlbumModalProps extends DialogProps {
  albumId: string | null;
  trackId: string | null;
  title: string;
  description?: string;
  albumName: string | null;
  imageUrl: string | null;
  artistName: string | null;
}

export function AlbumModal({ onClose, open, albumId, title, description, albumName, imageUrl, artistName, trackId }: AlbumModalProps) {
  return (
    <Suspense>
      <Dialog open={open} onClose={onClose} title={title} description={description}>
        <div className='flex flex-col items-center justify-center p-4'>
          {imageUrl && (
            <ImageComponent
              src={imageUrl}
              alt={albumName || "Album Image"}
              className='rounded-lg mb-2'
              width={200}
              height={200}
            />
          )}
          <h4 className='text-xl font-semibold mt-2'>{albumName}</h4>
          <p className='text-gray-600'>{artistName}</p>
        </div>
        <div className='flex justify-center flex-col p-4'>
          
        </div>
      </Dialog>
    </Suspense>
  );
}
