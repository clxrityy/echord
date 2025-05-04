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
    starsGiven: number;
  };
};

export function UserBox({ user, counts }: Readonly<Props>) {
  const { followers, following, reviews, favorites, saves, starsGiven } =
    counts;

  return (
    <div className='md:absolute top-2 right-[32.5%] md:right-2 px-6 py-4 md:h-[100px] w-full sm:w-auto h-auto'>
      <div className='flex flex-col items-center justify-start w-full md:w-[200px] h-[230px] md:h-[250px] rounded-t-lg px-4 py-2 bg-gray-400/5 drop-shadow-2xl shadow-xl gap-[7.5]'>
        <div className='flex items-center justify-center gap-4 w-full'>
          <ImageComponent
            src={user.avatar || '/img/default-avatar.png'}
            alt='User Avatar'
            width={50}
            height={50}
            className='rounded-3xl w-12 h-12 object-cover'
          />
          <div className='flex flex-col items-start justify-start gap-1'>
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
        <ul className='flex flex-col items-center justify-center md:items-start md:justify-start gap-[7.5] w-full h-full'>
          <li className='flex items-center justify-between w-1/3 md:w-full'>
            <span className='text-sm xl:text-base text-gray-300'>Reviews</span>
            <span className='text-sm text-gray-400'>{reviews}</span>
          </li>
          <li className='flex items-center justify-between w-1/3 md:w-full'>
            <span className='text-sm xl:text-base text-gray-300'>
              Favorites
            </span>
            <span className='text-sm text-gray-400'>{favorites}</span>
          </li>
          <li className='flex items-center justify-between gap-5 w-1/3 md:w-full'>
            <span className='text-sm xl:text-base text-gray-300'>Saves</span>
            <span className='text-sm xl:text-base text-gray-400'>{saves}</span>
          </li>
          <li className='flex items-center justify-between gap-5 w-1/3 md:w-full'>
            <span className='text-sm xl:text-base text-gray-300'>
              Stars given
            </span>
            <span className='text-sm xl:text-base text-gray-400'>
              {starsGiven}
            </span>
          </li>
        </ul>
      </div>
      <div className='relative w-full h-full flex items-start justify-center'>
        <div className='md:absolute left-0 md:-bottom-7 w-full h-[6rem] bg-gray-700/15 rounded-b-lg drop-shadow-2xl shadow-md flex items-center justify-center'>
          <div className='flex flex-col items-start justify-end gap-[5] w-2/3 md:w-full'>
            <div className='flex items-center justify-between px-4 py-2 w-full'>
              <span className='text-sm xl:text-base text-gray-300'>
                Followers
              </span>
              <span className='text-sm xl:text-base text-gray-400'>
                {followers}
              </span>
            </div>
            <div className='flex items-center justify-between gap-2 px-4 py-2 w-full'>
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
