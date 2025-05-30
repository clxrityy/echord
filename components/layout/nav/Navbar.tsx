'use client';
import { Search } from './Search';
import { ReactNode, Suspense, useEffect } from 'react';
import { ICONS } from '@/util';
import { useSession } from '@/contexts';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { InteractionHandler } from '../screen';
import { Header } from './Header';

export function NavbarContainer({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <nav className='navbar w-screen fixed top-0 z-50 shadow-md mx-0 right-0 left-0'>
      {children}
    </nav>
  );
}

export function Navbar({ userId }: Readonly<{ userId?: string }>) {
  const { setUserId, getUserId } = useSession();
  const router = useRouter();

  useEffect(() => {
    async function updateUserLastSeen() {
      try {
        const response = await fetch(`/api/user`, {
          method: 'PATCH',
          body: JSON.stringify({
            userId,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update user last seen');
        }
      } catch (error) {
        console.error('Error updating user last seen:', error);
      }
    }

    if (userId && userId !== getUserId()) {
      setUserId(userId);
      updateUserLastSeen();
      router.refresh();
    }
  }, [userId, getUserId()]);

  const handleProfileClick = () => router.push(`/profile/${userId}`);
  const handleLoginClick = () => router.push('/login');

  const {
    loading: IconLoading,
    user: IconUser,
    login: IconLogin,
    privacy: IconPrivacy,
  } = ICONS;

  return (
    <NavbarContainer>
      <div className='flex items-center justify-between w-full max-w-7xl mx-auto px-5'>
        {/**
         * RIGHT
         * - Logo & Title
         */}
        <Suspense
          fallback={
            <div className='animate-pulse'>
              <IconLoading className='animate-spin' />
              <span className='sr-only'>Loading...</span>
            </div>
          }
        >
          <Header />
        </Suspense>
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
              className='hover:contrast-200 transition-all duration-100 hover:scale-105 focus:text-blue-400/75'
              onClick={handleProfileClick}
            >
              <IconUser />
              <span className='sr-only'>Profile</span>
            </Button>
          ) : (
            <Button
              aria-label='Login'
              title='login'
              onClick={handleLoginClick}
              className='hover:contrast-200 transition-all duration-100 hover:scale-105 focus:text-blue-400/75'
            >
              <IconLogin />
              <span className='sr-only'>Login</span>
            </Button>
          )}
          <Button
            aria-label='Privacy Policy'
            title='privacy'
            onClick={() => router.push('/terms#privacy')}
            className='hover:contrast-200 transition-all duration-100 hover:scale-105 focus:text-blue-400/75 px-2'
          >
            <IconPrivacy className='' />
            <span className='sr-only'>Privacy Policy</span>
          </Button>
        </div>
      </div>
      {userId && (
        <Suspense>
          <InteractionHandler userId={userId} />
        </Suspense>
      )}
    </NavbarContainer>
  );
}
