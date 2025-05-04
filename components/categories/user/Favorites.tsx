import { ImageComponent, Tooltip } from '@/components/ui';
import { ICONS } from '@/util';
import { EInteractionData } from '@/prisma/app/generated/prisma/client';

interface FavoritesProps {
  interactionData: Partial<EInteractionData>[] | EInteractionData[];
}

export const Favorites = ({ interactionData }: FavoritesProps) => {
  if (!interactionData || interactionData.length === 0) {
    return <></>;
  }

  return (
    <div className='flex flex-col items-center justify-center w-full gap-2 relative md:mt-100 md:absolute md:left-0 md:top-0 md:translate-x-[35%] lg:translate-x-[40%] md:translate-y-0'>
      <h1 className='text-2xl font-bold mb-2 flex flex-row gap-2 items-center'>
        <Tooltip text='Favorites'>
          <ICONS.favorite />
          <span className='sr-only'>Favorites</span>
        </Tooltip>
      </h1>
      <div
        className={`grid grid-cols-1 ${interactionData.length > 1 && 'sm:grid-cols-2'} gap-4 border border-white/10 rounded-lg p-4 w-3/4 sm:w-auto`}
      >
        {interactionData.map((data, idx) => (
          <div
            key={data.id}
            className='shadow-md rounded-lg p-4 flex flex-col items-center'
          >
            {data.imageUrl && data.albumName && idx < 4 && (
              <ImageComponent
                src={data.imageUrl}
                alt={data.albumName}
                width={50}
                height={50}
                className='rounded-lg mb-2'
              />
            )}
            <h4 className='text-xl font-semibold mt-2'>{data.title}</h4>
            <p className='text-gray-600'>{data.artistName}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
