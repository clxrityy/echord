import { EAlbum } from '@prisma/client';

type Props = {
  album: EAlbum;
};

export function Album({ album }: Props) {
  if (!album) {
    return <h1 className=''>Album not found</h1>;
  }

  return (
    <div className='w-full h-full'>
      <h1>
        {album.title} by {album.artistName}
      </h1>
    </div>
  );
}
