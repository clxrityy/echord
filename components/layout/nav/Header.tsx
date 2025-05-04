'use client';

import Link from 'next/link';
import { ImageComponent } from '@/components/ui';
import { useScreenSize } from '@/hooks/useScreenSize';
import { useEffect, useState } from 'react';

export function Header() {
  const [imageSize, setImageSize] = useState<number>(35);

  const { width } = useScreenSize();

  useEffect(() => {
    if (width < 480) {
      setImageSize(30);
    } else if (width < 768) {
      setImageSize(35);
    } else if (width < 1024) {
      setImageSize(40);
    } else if (width < 1280) {
      setImageSize(45);
    } else {
      setImageSize(50);
    }
  }, [width]);

  return (
    <input
      title='Echord'
      type='button'
      className='flex items-center justify-center px-4 py-2'
    >
      <Link
        href='/'
        aria-label='Home'
        className='flex items-center focus:contrast-200 transition-all duration-100 justify-center gap-2 text-center'
      >
        <ImageComponent
          src={'/apple-touch-icon.png'}
          alt='Echord'
          width={imageSize}
          height={imageSize}
          className='grayscale-75 brightness-150'
        />
        <h1 className='tracking-wide font-rubica font-bold'>
          <span className='font-extrabold pr-[1.25px]'>E</span>
          <span className='pt-[1px]'>cho</span>
          <span>rd</span>
          <span className='sr-only'>Echord</span>
        </h1>
      </Link>
    </input>
  );
}
