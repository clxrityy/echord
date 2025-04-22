'use client';

import { ICONS } from '@/utils';
import { useRef, useState } from 'react';
import { OutsideClick } from '@/components/ui';

export function Settings() {
  const [clicked, setClicked] = useState<boolean>(false);

  const handleClick = () => {
    setClicked((prev) => !prev);
  };

  const handleOutsideClick = () => {
    setClicked(false);
  };

  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type='button'
        title='settings'
        role='button'
        onClick={handleClick}
        className='transition duration-200 focus:outline-none rounded-md hover:text-gray-400 focus:text-blue-400 mt-[1.5]'
      >
        <span className='sr-only'>Settings</span>
        <ICONS.settings className='h-12 w-12' />
      </button>
      <OutsideClick onOutsideClick={handleOutsideClick}>
        <dialog
          ref={dialogRef}
          className={`${clicked ? 'block' : 'hidden'} absolute top-20 right-0 w-3/4 h-[40vh] bg-black/35 z-10 rounded-lg shadow-lg backdrop-blur-md`}
        >
          <div className='flex flex-col h-full text-white items-center justify-start w-full pt-2 relative'>
            <h2>Account Settings</h2>
            <div className='w-full h-full flex flex-col items-center justify-start gap-2'></div>
          </div>
        </dialog>
      </OutsideClick>
    </>
  );
}
