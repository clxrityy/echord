'use client';
import { useRef, useEffect, ReactNode, ComponentProps } from 'react';
import { Button } from './Button';
import { ICONS } from '@/util';

export interface DialogProps extends ComponentProps<'dialog'> {
  title?: string;
  description?: string;
  onClose: () => void;
  open: boolean;
}

export function Dialog({
  title,
  description,
  onClose,
  open,
  children,
  ...props
}: DialogProps & {
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) {
      openDialog();
    }
     
  }, [open]);

  useEffect(() => {
    if (!open) {
      closeDialog();
    }
     
  }, [open]);

  const openDialog = () => {
    dialogRef.current?.showModal();
  };

  const closeDialog = () => {
    dialogRef.current?.close();
    onClose();
  };

  const { close: IconClose } = ICONS;

  return (
    <dialog
      ref={dialogRef}
      {...props}
      className='fixed top-50 left-50 -translate-x-45 -translate-y-0 z-10  rounded-xl backdrop:bg-gray-800/50'
    >
      <div className='w-[400px] max-w-full flex flex-col'>
        <div className='flex items-center justify-between p-4 border-b border-gray-200/20 rounded-sm'>
          <h2 className='text-lg font-semibold'>{title}</h2>
          <Button onClick={closeDialog}>
            <IconClose className='h-4 w-4' />
          </Button>
        </div>
        <div>
          {description && <p className='p-4 text-gray-600'>{description}</p>}
          <div className='p-4'>{children}</div>
        </div>
      </div>
    </dialog>
  );
}
