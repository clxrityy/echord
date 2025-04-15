'use client';
import {
  ComponentPropsWithoutRef,
  RefObject,
  useEffect,
  useState,
} from 'react';

export interface SkeletonProps extends ComponentPropsWithoutRef<'div'> {
  targetRef?: RefObject<HTMLDivElement | HTMLImageElement>;
}

export default function Skeleton({ targetRef, ...props }: SkeletonProps) {
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    if (targetRef?.current) {
      setWidth(targetRef.current.getBoundingClientRect().width);
      setHeight(targetRef.current.getBoundingClientRect().height);
    }
  }, [targetRef]);

  return (
    <div
      {...props}
      className={`animate-pulse bg-zinc-600/5 backdrop:blur-3xl rounded-md ${props.className}`}
      style={{
        width: width > 0 ? width : '100%',
        height: height > 0 ? height : '100%',
      }}
    />
  );
}
