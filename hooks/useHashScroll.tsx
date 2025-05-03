'use client';

import { useCallback, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function useHashScroll() {
  if (typeof window === 'undefined') {
    return;
  }

  const pathname = usePathname();

  const hash = window.location.hash;

  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [hash]);

  const handleHashChange = useCallback(() => {
    const hash = window.location.hash;
    if (hash) {
      console.log(hash);
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [pathname]);

  return <></>;
}
