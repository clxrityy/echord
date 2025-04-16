'use client';

import { Button } from '@/components/ui/Button';
import { ReactNode, useCallback, useState } from 'react';
import { AlbumModal } from '@/components/elements/modals/AlbumModal';

export function Save({
  children,
  save,
}: {
  children: ReactNode;
  save: {
    albumId: string | null;
    albumName: string | null;
  };
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      <AlbumModal
        albumId={save.albumId || ''}
        onClose={handleClose}
        open={isOpen}
        title={save.albumName || ''}
      />
      <Button
        onClick={() => setIsOpen((prev) => !prev)}
        className='hover:border-2 border-gray-300/75 transition-colors duration-50 ease-linear z-20 rounded-lg focus:border-[3] focus:border-gray-300'
      >
        {children}
      </Button>
    </>
  );
}
