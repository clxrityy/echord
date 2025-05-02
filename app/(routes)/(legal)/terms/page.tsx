'use client';
import Outline from './outline.mdx';
import Terms from './terms.mdx';

export default function Page() {
  return (
    <div className='flex flex-col items-start justify-start w-full gap-3 px-4 py-8 mx-auto max-w-4xl'>
      <Outline />
      <Terms />
    </div>
  );
}
