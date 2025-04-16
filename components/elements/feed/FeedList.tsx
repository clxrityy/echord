"use client";
import { Children, ReactNode, useState } from 'react';
import { Pagination } from '../../ui/Pagination';

export function FeedList({ children, itemsPerPage }: { children: ReactNode, itemsPerPage: number }) {

  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalItems = Children.count(children);
  const startIndex = (currentPage - 1) * itemsPerPage;

  return (
    <div className='w-full h-full flex flex-col items-center justify-center relative'>
      <ul className='w-full h-fit lg:h-full flex flex-col lg:grid xl:grid-cols-2 lg:w-fit 2xl:max-w-4xl gap-0 items-center justify-start px-4 rounded-lg shadow-xl shadow-gray-700/15 relative overflow-y-scroll max-h-fit lg:max-h-[calc(150vh)] xl:max-h-[calc(200vh)] lg:pt-0 pb-18 sm:pb-12 mt-10'>
        {
          Children.map(children, (child, index) => {
            if (index >= startIndex && index < startIndex + itemsPerPage) {
              return (
                <template key={index} className='w-full h-full flex items-start justify-center py-2 px-4'>
                  {child}
                </template>
              );
            }
            return null;
          })
        }
      </ul>
      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={(page: number) => setCurrentPage(page)}
      />
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
