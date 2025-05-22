'use client';

import { StringOrUndefined } from '@/types';
import '@/styles/css/hero.css';
import Link from 'next/link';
import { Button, ImageComponent } from '@/components/ui';
import { ICONS } from '@/util';
import { Search } from '@/components/layout';
import { ReactNode, Suspense } from 'react';
import { useRouter } from 'next/navigation';

const { login: IconLogin, privacy: IconPrivacy, user: IconUser } = ICONS;

export function Hero({ userId }: Readonly<{ userId: StringOrUndefined }>) {
  return (
    <div className='w-full h-full flex flex-col items-center justify-start gap-5 py-10 px-10'>
      {!userId ? (
        <div className='w-full h-full flex flex-col items-center justify-center gap-2'>
          <div>
            <Suspense>
              <h1 className='text-4xl font-bold text-center'>
                Welcome to 乇chord
              </h1>
            </Suspense>
            <p className='text-lg text-center mb-8'>
              Join and start cataloging your music collection
            </p>
          </div>
          <Button className='bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200'>
            <Link prefetch={false} href={'/login'}>
              Get Started
            </Link>
          </Button>
        </div>
      ) : (
        <div className='w-full h-max flex flex-col items-center justify-center gap-2 2xl:mt-30'>
          <div className='grid grid-cols-1 2xl:grid-cols-1 items-center justify-center mb-4 gap-4 w-full'>
            <div className='flex flex-col items-center justify-center'>
              <Suspense>
                <h1 className='text-4xl font-bold text-center mb-4'>
                  Welcome Back!
                </h1>
              </Suspense>
              <p className='text-lg text-center mb-8'>
                Explore your personalized feed and discover new content.
              </p>
            </div>
          </div>
        </div>
      )}
      <div className='flex flex-col lg:flex-row items-center justify-center gap-3 mb-10 xl:mb-0'>
        <p className='font-rubica text-3xl tracking-wide'>Search</p>{' '}
        <Search size={35} />
      </div>
      <hr className='w-1/3 h-1 bg-gradient-to-r from-blue-600/50 to-blue-400/30 rounded-full mt-10 xl:mt-0 mb-10' />
      <HeroNav userId={userId} />
    </div>
  );
}

export function Logo() {
  return (
    <ImageComponent
      src='/apple-touch-icon.png'
      alt='logo'
      className='rounded-full logo h-50 w-50'
      width={75}
      height={75}
      priority
    />
  );
}

export function HeroNav({ userId }: Readonly<{ userId: StringOrUndefined }>) {
  const router = useRouter();

  return (
    <div className='w-full h-full flex flex-col items-center justify-center gap-10 py-10 px-10'>
      <div className='flex items-center gap-2 justify-center'>
        <h1 className='text-5xl font-bold text-center font-rubica'>乇chord</h1>
        <Logo />
      </div>
      <div className='flex flex-col w-full items-center justify-center gap-8 lg:flex-row lg:gap-4 *:bg-blue-400/15 *:rounded-md *:p-3 *:shadow-md *:flex *:items-center *:justify-center *:hover:scale-95 *:transition-all *:duration-200 *:focus:ring-2 *:focus:ring-blue-500 *:w-full *:md:w-2/3 *:lg:w-1/3'>
        {userId ? (
          <Button
            onClick={() => router.push(`/profile/${userId}`)}
            className='font-rubica'
            aria-label='Profile'
            title='profile'
          >
            <IconWrapper>
              <IconUser />
            </IconWrapper>{' '}
            Profile
          </Button>
        ) : (
          <Button
            onClick={() => router.push(`/login`)}
            role='login'
            className='font-rubica'
            aria-label='Login'
            title='login'
          >
            <IconWrapper>
              <IconLogin />
            </IconWrapper>
            Login
          </Button>
        )}
        <Button
          onClick={() => router.push(`/terms#privacy`)}
          role=''
          className='font-rubica'
          aria-label='Privacy Policy'
          title='privacy'
        >
          <IconWrapper>
            <IconPrivacy />
          </IconWrapper>{' '}
          Privacy Policy
        </Button>
      </div>
    </div>
  );
}

export function IconWrapper({ children }: Readonly<{ children: ReactNode }>) {
  return <div className='p-2'>{children}</div>;
}
