'use client';

import { Button } from '@/components/ui';
import { ReactNode, useCallback, useState } from 'react';
import { AlbumModal } from '@/components/categories/modals';
import { EInteractionData } from '@/prisma/app/generated/prisma/client';

export function UserSave({
  children,
  save,
}: Readonly<{
  children: ReactNode;
  save: EInteractionData;
}>) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      <AlbumModal
        albumId={save.albumId}
        onClose={handleClose}
        open={isOpen}
        title={save.title ?? ''}
        trackId={save.trackId}
        albumName={save.albumName}
        imageUrl={save.imageUrl}
        artistName={save.artistName}
      />
      <Button
        onClick={() => setIsOpen((prev) => !prev)}
        className='hover:border-2 border-gray-300/75 transition-colors duration-50 ease-in z-20 rounded-lg focus:border-[3] focus:border-gray-300/70 *:opacity-80 *:hover:opacity-100'
      >
        {children}
      </Button>
    </>
  );
}
