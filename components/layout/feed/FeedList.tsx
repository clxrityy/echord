export function FeedList({children}: {children: React.ReactNode}) {
  return (
    <ul className="w-full h-screen xl:h-full flex flex-col gap-5 items-start justify-around bg-gray-900/20 px-4 py-2 rounded-xl gap-2 xl:border border-gray-300/20 shadow">
      {children}
    </ul>
  );
}

export function FeedListItem({children}: {children: React.ReactNode}) {
  return (
    <li className="w-full h-full flex items-center justify-center py-2 px-4">
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
