'use client';
import { useCallback, useEffect, useState } from 'react';

export const useScreenSize = () => {
  if (typeof window === 'undefined') {
    return {
      width: 0,
      height: 0,
    };
  }

  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const handleResize = useCallback(() => {
    setScreenSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return screenSize;
};
