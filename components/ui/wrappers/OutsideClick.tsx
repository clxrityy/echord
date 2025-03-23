'use client';
import { useRef, useEffect, ReactNode } from 'react';

interface OutsideClickProps {
  children: ReactNode;
  onOutsideClick: () => void;
}

export function OutsideClick({ children, onOutsideClick }: OutsideClickProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        onOutsideClick();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onOutsideClick]);

  return <div ref={wrapperRef}>{children}</div>;
}
// This component wraps its children and listens for clicks outside of it, triggering the onOutsideClick callback when such a click is detected.
// It uses a ref to keep track of the wrapper element and adds an event listener to the document to handle mouse clicks. When the component unmounts, it cleans up the event listener to prevent memory leaks.
