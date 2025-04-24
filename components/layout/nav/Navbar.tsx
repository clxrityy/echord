'use client';
import { ImageComponent } from '@/components/ui/Image';
import Link from 'next/link';
import { Search } from './Search';
import { ReactNode, Suspense, useEffect } from 'react';
import { ICONS } from '@/utils/constants';
import { useSession } from '@/contexts';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { InteractionHandler } from '../screen';

export function NavbarContainer({ children }: { children: ReactNode }) {
  return (
    <nav className='navbar w-screen fixed top-0 z-50 shadow-md mx-0 right-0 left-0'>
      {children}
    </nav>
  );
}

export function Navbar({ userId }: { userId?: string | undefined }) {
  const { setUserId, getUserId } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (userId && userId !== getUserId()) {
      setUserId(userId);
    }
  }, [userId, getUserId()]);

  const handleProfileClick = () => router.push(`/profile/${userId}`);
  const handleLoginClick = () => router.push('/login');

  // const handleLogoutClick = () => {
  //   setUserId(undefined);
  //   router.push('/login');
  // }

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
            aria-label='Home'
            className='flex items-center focus:contrast-200 transition-all duration-100 justify-center gap-2 text-center'
          >
            <ImageComponent
              src={'/apple-touch-icon.png'}
              alt='Echord'
              width={35}
              height={35}
              className='grayscale-75 brightness-150'
            />
            <h1 className='tracking-tighter font-[var(--font-tmr)]'>
              <span className='font-extrabold'>乇</span>
              <span className='uppercase'>chord</span>
              <span className='sr-only'>Echord</span>
            </h1>
          </Link>
        </div>
        {/**
         * LEFT
         * - Search
         * - Profile/Login
         */}
        <div className='flex items-center gap-4 justify-end px-4 py-2'>
          <Search />
          {userId ? (
            <Button
              aria-label='Profile'
              title='profile'
              onClick={handleProfileClick}
            >
              <ICONS.user />
              <span className='sr-only'>Profile</span>
            </Button>
          ) : (
            <Button aria-label='Login' title='login' onClick={handleLoginClick}>
              <ICONS.login />
              <span className='sr-only'>Login</span>
            </Button>
          )}
        </div>
      </div>
      <Suspense>
        <InteractionHandler userId={userId} />
      </Suspense>
    </NavbarContainer>
  );
}
