import { ReactNode } from "react";

export function FeedList({children}: {children: ReactNode}) {
  return (
    <ul className="w-full h-full flex flex-col 2xl:grid lg:grid 2xl:grid-cols-2 2xl:max-w-4xl gap-5 items-start justify-center px-4 rounded-lg shadow-xl shadow-gray-700/15 relative overflow-y-auto max-h-[calc(100vh-0.1rem)] mb-50 mt-20">
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
