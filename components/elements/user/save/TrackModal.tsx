'use client';
import { OutsideClick } from '@/components/ui/wrappers/OutsideClick';
import { useWindow } from '@/contexts/window';

export const TrackModal = () => {
  const { getCurrentOpenModal, closeModal } = useWindow();
  const currentModal = getCurrentOpenModal();

  if (currentModal?.title !== 'track') return null;

  return (
    <OutsideClick onOutsideClick={closeModal}>
      <dialog className='absolute w-full h-full backdrop:blur-3xl rounded-lg border-2 border-gray-200/10 transition-colors duration-50 ease-linear focus:border-[1.5] focus:border-gray-200/30 z-50'>
        <div className='w-4/5 h-full flex items-start justify-start relative'>
          hey
        </div>
      </dialog>
    </OutsideClick>
  );
};
