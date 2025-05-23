import { Copy } from '@/components/ui';
import { BASE_URL } from '@/util';

export function Heading({ id, title }: { id: string; title: string }) {
  return (
    <div className='flex flex-row gap-2 items-center'>
      <Copy value={`${BASE_URL}/terms#${id}`} />
      <h2 id={id} className='h2-md'>
        {title}
      </h2>
    </div>
  );
}
