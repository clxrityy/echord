'use client';
import Image, { type ImageProps } from 'next/image';
import { useRef } from 'react';

export const ImageComponent = ({ ...props }: ImageProps) => {

  const ref = useRef<HTMLImageElement>(null);
  
  return (
      <Image
        {...props}
        alt={props.alt || 'Image'}
        width={props.width ?? 100}
        height={props.height ?? 100}
        src={props.src}
        ref={ref}
        className={props.className}
      />
  );
};
