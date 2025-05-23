import { checkAlbumFromInteraction } from '@/app/_actions';
import { Metadata } from 'next';
import { connection } from 'next/server';
import { ReactNode } from 'react';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;

  const album = await checkAlbumFromInteraction(id);

  if (!album) {
    return {
      title: 'Album not found',
      description: 'Album not found',
    };
  }

  return {
    title: `${album.title} by ${album.artistName}`,
    keywords: [
      'Echord',
      'Album',
      'Music',
      'Music Album',
      `${album.title}`,
      `${album.artistName}`,
      `${album.title} by ${album.artistName}`,
      `${album.artistName} Album`,
      `${album.title} Album`,
      `${album.title} by ${album.artistName} Album`,
      `${album.title} by ${album.artistName} Music`,
      `${album.artistName} Music`,
    ],
    description: `${album.title} by ${album.artistName}`,
    openGraph: {
      title: album.title,
      description: `${album.title} by ${album.artistName}`,
      url: `https://echord.uk/album/${id}`,
    },
    twitter: {
      title: album.title,
      description: `${album.title} by ${album.artistName}`,
      card: 'summary',
      images: [
        {
          url: album.imageUrl!,
          alt: `${album.title} by ${album.artistName}`,
          width: 400,
          height: 400,
        },
      ],
    },
    icons: {
      icon: album.imageUrl!,
      shortcut: '/favicon.ico',
      apple: '/favicon.ico',
      other: {
        rel: 'apple-touch-icon',
        url: '/favicon.ico',
      },
    },
    appleWebApp: {
      title: `Echord | ${album.title}`,
      statusBarStyle: 'black-translucent',
      capable: true,
    },
    alternates: {
      canonical: `https://echord.uk/album/${id}`,
    },
    metadataBase: new URL('https://echord.uk'),
    robots: {
      index: true,
      follow: true,
      nocache: false,
      noarchive: false,
      noimageindex: false,
      notranslate: false,
    },
  };
}

export default async function AlbumLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  await connection();

  return <div className='mt-30 w-full h-full relative'>{children}</div>;
}
