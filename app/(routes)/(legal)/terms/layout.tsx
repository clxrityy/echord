import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for Echord',
};

export default async function TermsLayout({
  children,
  privacy,
}: {
  children: ReactNode;
  privacy: ReactNode;
}) {
  return (
    <div className='flex flex-col items-start justify-start w-full h-full gap-2 px-4 py-8 mx-auto max-w-6xl max-h-[calc(100vh-4rem)] overflow-y-auto overflow-clip scroll-smooth mt-30'>
      <div className='flex flex-col items-center justify-center w-full gap-2 px-4 py-2 mb-4 text-center'>
        <h1 className='font-rubica'>
          Terms of Service
        </h1>
        <p>
          Last updated: <span className='font-semibold'>October 1, 2023</span>
        </p>
      </div>
      {children}
      {privacy}
    </div>
  );
}
