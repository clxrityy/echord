'use client';
import Image, { type ImageProps } from 'next/image';
import { useRef, useState, RefObject } from 'react';
import Skeleton from './Skeleton';

export const ImageComponent = ({ ...props }: ImageProps) => {
  const [loading, setLoading] = useState<boolean>(true);

  const ref = useRef<HTMLImageElement>(null);

  return (
    <>
      {loading && (
        <Skeleton
          targetRef={ref as RefObject<HTMLImageElement>}
          style={{
            width: props.width || 100,
            height: props.height || 100,
          }}
        />
      )}
      <Image
        {...props}
        alt={props.alt || 'Image'}
        width={props.width || 100}
        height={props.height || 100}
        src={props.src}
        ref={ref}
        onLoad={() => setLoading(false)}
        className={`rounded-md ${loading ? 'invisible' : 'visible'} ${props.className}`}
      />
    </>
  );
};
