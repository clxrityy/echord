import { ReactNode } from "react";

export function FeedList({children}: {children: ReactNode}) {
  return (
    <ul className="w-full h-full flex flex-col 2xl:grid lg:grid 2xl:grid-cols-2 2xl:max-w-4xl gap-5 items-start justify-start px-4 rounded-lg shadow-xl shadow-gray-700/15 relative overflow-y-scroll max-h-[calc(150vh)] xl:max-h-[calc(200vh)] pt-50 lg:pt-0 pb-18 sm:pb-12 mt-20">
      {children}
    </ul>
  );
}

export function FeedListItem({children}: {children: ReactNode}) {
  return (
    <li className="w-full h-full flex items-start justify-center py-2 px-4">
      {children}
    </li>
  );
}

export function FeedListItemSkeleton() {
  return (
    <li className="w-full h-full flex items-center justify-center py-10 px-4">
      <div className="w-full h-20 rounded-md bg-gray-700/30 animate-pulse" />
    </li>
  );
}
