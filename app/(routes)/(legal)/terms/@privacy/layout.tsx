import { ReactNode } from 'react';

export default function PrivacyLayout({ children }: { children: ReactNode }) {
  return (
    <div className='w-full h-full relative flex flex-col items-start justify-start gap-2 px-4 py-8 mx-auto'>
      <div className='flex flex-col items-center justify-center w-full gap-2 px-4 py-2 mb-4 text-center'>
        <span className='sr-only' id='privacy'>
          Privacy Policy
        </span>
        <h1 className='font-rubica'>Privacy Policy</h1>
        <p>
          Last updated: <span className='font-semibold'>May 2, 2025</span>
        </p>
      </div>
      <div className='flex flex-col items-start justify-start w-full h-full gap-2 px-4 py-2 text-left'>
        {children}
      </div>
    </div>
  );
}
