'use client';
import { ChangeEvent, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { BASE_URL, ICONS } from '@/utils';
import { OutsideClick } from '@/components/ui/wrappers/OutsideClick';
import { useSession } from '@/contexts/session';
import { Button } from '@/components/ui/Button';

export function Search() {
  const [searchField, setSearchField] = useState<string>('');
  const [clicked, setClicked] = useState<boolean>(false);

  const router = useRouter();

  const { addSearch, searches, getSessionId } = useSession();

  useEffect(() => {
    async function addSearchToSession(search: string) {
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

  return (
    <div role='search' className=''>
      <OutsideClick onOutsideClick={() => setClicked(false)}>
        <div className='flex flex-col items-center relative gap-5'>
          <Button
            role='button'
            title='Search'
            aria-label='Search'
            onClick={handleClick}
            className={`${clicked ? 'ring-2 ring-blue-500' : ''} p-2 transition duration-200 focus:outline-none rounded-md`}
          >
            <ICONS.search />
          </Button>
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
    </div>
  );
}
