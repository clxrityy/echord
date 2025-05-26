import Link from 'next/link';

export function Footer() {
  return (
    <footer className='fixed bottom-0 left-0 right-0 w-screen flex items-center justify-center border-t bg-gradient-to-b from-gray-800/25 to-gray-900/45 border-gray-700 backdrop:blur-3xl z-50'>
      <div className='flex items-center justify-between max-w-7xl w-screen px-6 py-4 relative text-xs'>
        <p>
          <span className='text-gray-400'>
            &copy; {new Date().getFullYear()} - All rights reserved.
          </span>
        </p>
        <div className='flex items-center gap-4'>
          <Link href={'/terms'}>
            <span className='text-gray-400 hover:text-blue-500 transition'>
              Terms of Service
            </span>
          </Link>
          <Link href={'/terms#privacy'}>
            <span className='text-gray-400 hover:text-blue-500 transition'>
              Privacy Policy
            </span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
