import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ICONS } from '@/util';

const { home: IconHome } = ICONS;

export default function NotFound() {
  return (
    <div className='font-[var(--font-tmr)] w-full h-full flex items-center justify-center gap-4 bg-black/35 backdrop-blur-sm'>
      <div className='relative flex justify-center items-center w-full'>
        <div className='flex flex-col items-center justify-center w-full h-full gap-10'>
          <div className='flex flex-col items-center justify-center w-full gap-2 xl:gap-4'>
            <h1 className='text-7xl font-extrabold'>404</h1>
            <p>Page not found</p>
          </div>
          <Button>
            <Link
              href={'/'}
              className='flex items-center justify-center bg-blue-500 text-white hover:bg-blue-600 duration-200 transition-colors focus:ring ease-out px-6 py-2 rounded-lg'
            >
              <IconHome className='w-8 h-8' />
              <span className='sr-only'>Go to home page</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
