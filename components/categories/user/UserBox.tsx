import { ImageComponent } from '@/components/ui';
import { EUser } from '@/prisma/app/generated/prisma/client';

type Props = {
  user: EUser;
  counts: {
    followers: number;
    following: number;
    reviews: number;
    favorites: number;
    saves: number;
  };
};

export function UserBox({ user, counts }: Props) {
  const { followers, following, reviews, favorites, saves } = counts;

  return (
    <div className='absolute top-2 left-2 px-4 py-2 h-[100px]'>
      <div className='flex flex-col items-center justify-start gap-4 w-[200px] h-[200px] rounded-lg shadow-md'>
        <div className='flex items-center justify-center gap-4 w-full'>
          <ImageComponent
            src={user.avatar || '/img/default-avatar.png'}
            alt='User Avatar'
            width={50}
            height={50}
            className='rounded-3xl w-12 h-12 object-cover'
          />
          <div className='flex flex-col items-start justify-start'>
            <h4 className='text-lg xl:text-xl text-gray-200 font-semibold'>
              {user.username}
            </h4>
            <p className='text-sm text-gray-300'>
              Last seen:{' '}
              <span className='text-gray-400'>
                {user.updatedAt.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </p>
          </div>
        </div>
        <ul className='flex flex-col items-start justify-start gap-2 w-full h-full'>
          <li className='flex items-center justify-between w-full'>
            <span className='text-sm xl:text-base text-gray-300'>Reviews</span>
            <span className='text-sm text-gray-400'>{reviews}</span>
          </li>
          <li className='flex items-center justify-between w-full'>
            <span className='text-sm xl:text-base text-gray-300'>
              Favorites
            </span>
            <span className='text-sm text-gray-400'>{favorites}</span>
          </li>
          <li className='flex items-center justify-between w-full'>
            <span className='text-sm xl:text-base text-gray-300'>Saves</span>
            <span className='text-sm xl:text-base text-gray-400'>{saves}</span>
          </li>
        </ul>
      </div>
      <div className='relative w-full h-[100%]'>
        <div className='absolute bottom-0 left-0 w-full bg-gray-700/25 rounded-b-lg drop-shadow-2xl shadow-md'>
          <div className='flex flex-col items-start justify-end gap-2 w-full'>
            <div className='flex items-center justify-between px-4 py-2 gap-2'>
              <span className='text-sm xl:text-base text-gray-300'>
                Followers
              </span>
              <span className='text-sm xl:text-base text-gray-400'>
                {followers}
              </span>
            </div>
            <div className='flex items-center justify-between gap-2 px-4 py-2'>
              <span className='text-sm xl:text-base text-gray-300'>
                Following
              </span>
              <span className='text-sm xl:text-base text-gray-400'>
                {following}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
