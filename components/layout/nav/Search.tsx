'use client';
import { ChangeEvent, useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { BASE_URL, ICONS } from '@/util';
import { useSession } from '@/contexts';
import { Button, OutsideClick } from '@/components/ui';

export interface SearchProps {
  size?: number;
}

export function Search({ size }: Readonly<SearchProps>) {
  const [searchField, setSearchField] = useState<string>('');
  const [clicked, setClicked] = useState<boolean>(false);

  const router = useRouter();

  const { addSearch, searches, getSessionId } = useSession();

  const pathname = usePathname();

  const isHomePage = pathname === '/';


  useEffect(() => {
    async function addSearchToSession(search: string) {
      if (getSessionId() === '') {
        return;
      }
      const res = await fetch(`${BASE_URL}/api/session/search`, {
        method: 'POST',
        body: JSON.stringify({
          search: search,
          sessionId: getSessionId(),
        }),
      }).then((res) => res.json());

      return res;
    }

    if (searchField.length > 2) {
      const timeoutId = setTimeout(() => {
        if (!searches.includes(searchField)) {
          addSearchToSession(searchField).then((data) => {
            if (data) {
              addSearch(searchField);
            }
          });
        }
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

  const { search: IconSearch } = ICONS;

  return (
    <div role='search' className='w-full flex items-center justify-center'>
      <OutsideClick onOutsideClick={() => setClicked(false)}>
        <div className='flex flex-col items-center relative gap-5 w-full'>
          <Button
            role='search'
            title='Search'
            aria-label='Search'
            onClick={handleClick}
            className={`${clicked ? 'ring-2 ring-blue-500' : ''} p-2 transition duration-200 focus:outline-none rounded-md hover:contrast-200 focus:text-blue-400/80 hover:scale-105 active:scale-95`}
          >
            <IconSearch size={size} />
          </Button>
          {clicked && (
            <input
              type='text'
              placeholder='Search'
              value={searchField}
              onChange={handleChange}
              className={`${isHomePage ? "-right-0 -left-18 w-max mt-4 lg:-left-32" : "w-64"} p-2 border border-white/50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 absolute top-18 right-0 z-50 shadow-md`}
            />
          )}
        </div>
      </OutsideClick>
    </div>
  );
}
