import { ImageComponent } from '@/components/ui/Image';
import Link from 'next/link';
import { Search } from './Search';
import { ReactNode } from 'react';

export function NavbarContainer({ children }: { children: ReactNode }) {
  return (
    <nav className='navbar w-screen fixed top-0 z-50 shadow-md mx-0 right-0 left-0'>
      {children}
    </nav>
  );
}

export function Navbar() {
  return (
    <NavbarContainer>
      <div className='flex items-center justify-between w-full max-w-7xl mx-auto px-5'>
        {/**
         * RIGHT
         * - Logo & Title
         */}
        <div className='flex items-center justify-center px-4 py-2'>
          <Link
            href='/'
            className='flex items-center focus:contrast-200 transition-all duration-100 justify-center gap-2 text-center'
          >
            <ImageComponent
              src={'/apple-touch-icon.png'}
              alt='Echord'
              width={35}
              height={35}
              className='grayscale-75 brightness-150'
            />
            <h1 className='tracking-wide'>
              <span className='font-extrabold'>乇</span>
              <span className='uppercase'>chord</span>
            </h1>
          </Link>
        </div>
        {/**
         * LEFT
         * - Search
         */}
        <div className='flex items-center justify-end px-4 py-2'>
          <Search />
        </div>
      </div>
    </NavbarContainer>
  );
}
