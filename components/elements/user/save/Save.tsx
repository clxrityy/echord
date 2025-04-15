'use client';

import { Button } from '@/components/ui/Button';
import { useWindow } from '@/contexts/window';
import { ReactNode, useCallback } from 'react';

export function Save({ children }: { children: ReactNode }) {
  const { getCurrentOpenModal, setCurrentOpenModal, closeModal } = useWindow();

  const currentModal = getCurrentOpenModal();

  const handleClick = useCallback(() => {
    if (currentModal) {
      closeModal();
    } else {
      setCurrentOpenModal('track');
    }

    console.log('currentModal', currentModal);
  }, [currentModal]);

  return (
    <Button
      onClick={handleClick}
      className='hover:border-2 border-gray-300/75 transition-colors duration-50 ease-linear z-20 rounded-lg focus:border-[3] focus:border-gray-300'
    >
      {children}
    </Button>
  );
}
