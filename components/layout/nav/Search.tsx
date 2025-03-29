'use client';
import { ChangeEvent, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ICONS } from '@/utils/constants';
import { OutsideClick } from '@/components/ui/wrappers/OutsideClick';

export function Search() {
  const [searchField, setSearchField] = useState<string>('');
  const [clicked, setClicked] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    if (searchField.length > 2) {
      const timeoutId = setTimeout(() => {
        router.push(`/search/${searchField}`);
      }, 500);

      return () => {
        clearTimeout(timeoutId);
      };
    } else if (searchField.length === 0 && clicked) {
      router.push('/');
    }
  }, [searchField]);

  const handleChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchField(e.target.value);
  }, []);

  const handleClick = useCallback(() => {
    setClicked(!clicked);
  }, [clicked]);

  return (
    <search role='search' className=''>
      <OutsideClick onOutsideClick={() => setClicked(false)}>
        <div className='flex flex-col items-center relative gap-5'>
          <button
            role='button'
            onClick={handleClick}
            className={`${clicked ? 'ring-2 ring-blue-500' : ''} p-2 transition duration-200 focus:outline-none rounded-md`}
          >
            <ICONS.search />
          </button>
          {clicked && (
            <input
              type='text'
              placeholder='Search'
              value={searchField}
              onChange={handleChange}
              className='w-64 p-2 border border-white/50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 absolute top-18 right-0 z-10 shadow-md'
            />
          )}
        </div>
      </OutsideClick>
    </search>
  );
}
