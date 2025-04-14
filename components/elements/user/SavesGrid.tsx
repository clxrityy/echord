import { ImageComponent } from '@/components/ui/Image';
import { EInteractionData } from '@prisma/client';

interface SavesGridProps {
  saves: EInteractionData[];
}

export function SavesGrid({ saves }: SavesGridProps) {
  const length = saves.length;

  const determineSize = (ln: number) => {
    if (ln > 50) {
      return 10;
    } else if (ln > 40) {
      return 12;
    } else if (ln > 30) {
      return 15;
    } else if (ln > 20) {
      return 20;
    } else if (ln > 10) {
      return 25;
    } else if (ln > 5) {
      return 30;
    }
    if (ln > 28) {
      return 15;
    }
    if (ln > 2) {
      return 25;
    } else if (ln === 2) {
      return 50;
    } else {
      return 75;
    }
  };

  return (
    <div className='flex flex-col gap-0 h-screen mt-22 justify-end items-start fixed bottom-0 left-0'>
      {saves.map((save, idx) =>
        save.imageUrl && save.title ? (
          <ImageComponent
            key={idx}
            src={save.imageUrl}
            alt={save.title}
            className='grayscale-50'
            width={determineSize(length)}
            height={determineSize(length)}
            loading='lazy'
            blurDataURL={save.imageUrl ?? ''}
          />
        ) : (
          <div key={idx} className='w-full h-full' />
        )
      )}
    </div>
  );
}
