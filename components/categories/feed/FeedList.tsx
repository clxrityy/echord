'use client';
import { Children, ReactNode, Suspense, useState } from 'react';
import { Pagination, Skeleton } from '@/components/ui';

export function FeedList({
  children,
  itemsPerPage,
}: {
  children: ReactNode;
  itemsPerPage: number;
}) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalItems = Children.count(children);
  const startIndex = (currentPage - 1) * itemsPerPage;

  return (
    <div className='w-full h-fit lg:h-full flex flex-col items-center justify-center relative'>
      <ul className='w-full h-fit lg:h-full flex flex-col lg:grid xl:grid-cols-2 lg:w-fit 2xl:max-w-4xl gap-0 items-center justify-start px-4 rounded-lg shadow-xl shadow-gray-700/15 relative overflow-y-scroll max-h-[calc(100vh)] xl:max-h-[calc(200vh)] lg:pt-0 pb-10 sm:pb-8 mt-10'>
        {Children.map(children, (child, index) => {
          if (index >= startIndex && index < startIndex + itemsPerPage) {
            return child;
          }
          return null;
        })}
      </ul>
      <Suspense
        fallback={
          <Skeleton className='w-full h-10 animate-pulse bg-gray-700/40 backdrop-blur-2xl rounded-md shadow' />
        }
      >
        <Pagination
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </Suspense>
    </div>
  );
}

export function FeedListItem({ children }: { children: ReactNode }) {
  return (
    <li className='w-full h-full flex items-start justify-center py-2 px-4'>
      {children}
    </li>
  );
}

export function FeedListItemSkeleton() {
  return (
    <li className='w-full h-full flex items-center justify-center py-10 px-4'>
      <div className='w-[14rem] h-[7.5rem] rounded-md bg-gray-700/30 animate-pulse' />
    </li>
  );
}
