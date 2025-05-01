'use client';

import { Button } from '@/components/ui';
import { ReactNode, useCallback, useState } from 'react';
import { AlbumModal } from '@/components/categories/modals';

export function UserSave({
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
        className='hover:border-2 border-gray-300/75 transition-colors duration-50 ease-in z-20 rounded-lg focus:border-[3] focus:border-gray-300/70'
      >
        {children}
      </Button>
    </>
  );
}
