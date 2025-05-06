import { db } from '@/lib';
import { BASE_URL } from '@/util';
import { Metadata } from 'next';
import { ReactNode } from 'react';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;

  const profileUser = await db.eUser.findUnique({
    where: {
      userId: id,
    },
  });

  if (!profileUser) {
    return {
      title: 'User not found',
    };
  }

  return {
    title: `${profileUser.username} | Echord`,
    description: `Profile page of ${profileUser.username}`,
    openGraph: {
      title: `Echord | ${profileUser.username}`,
      description: `Profile page of ${profileUser.username}`,
      url: `${BASE_URL}/profile/${profileUser.userId}`,
      images: [
        {
          url:
            profileUser.avatar || `${BASE_URL}/img/default-avatar.png`,
          width: 250,
          height: 250,
        },
      ],
    },
    twitter: {
      title: `Echord | ${profileUser.username}`,
      description: `Profile page of ${profileUser.username}`,
      images: [
        {
          url:
            profileUser.avatar || 'https://echord.com/img/default-avatar.png',
          width: 250,
          height: 250,
        },
      ],
      card: 'summary_large_image',
    },
  };
}

export default async function Layout({ children }: { children: ReactNode }) {
  return <div className='w-full h-full relative'>{children}</div>;
}
