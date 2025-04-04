export function FeedList({children}: {children: React.ReactNode}) {
  return (
    <ul className="w-full xl:h-screen flex flex-col gap-5 items-start justify-around xl:bg-gray-900/20 px-4 py-2 rounded-sm gap-2 xl:border-l border-gray-300/20 shadow overflow-y-scroll z-40 relative xl:pr-4 overflow-y-auto xl:max-h-[calc(100vh-10rem)] pb-10 pt-5 z-40">
      {children}
    </ul>
  );
}

export function FeedListItem({children}: {children: React.ReactNode}) {
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
