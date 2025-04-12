import { checkAlbumFromInteraction } from "@/handlers/data";
import { db } from "@/lib/db";
import { Metadata } from "next";
import { connection } from "next/server";
import { ReactNode } from "react";

type Props = {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: Props):Promise <Metadata> {
  const id = (await params).id;

  const existingData = await checkAlbumFromInteraction(id);

  const album = await db.eAlbum.findFirst({
    where: {
      albumId: id,
    }
  })

  if (!album) {
    return {
      title: "Album not found",
      description: "Album not found",
    };
  }

  return {
    title: album.title,
    description: `${album.title} by ${album.artistName}`,
    openGraph: {
      title: album.title,
      description: `${album.title} by ${album.artistName}`,
      url: `https://echord.uk/album/${id}`,
    },
    twitter: {
      title: album.title,
      description: `${album.title} by ${album.artistName}`,
      card: "summary",
      images: [
        {
          url: album.imageUrl!,
          alt: `${album.title} by ${album.artistName}`,
          width: 400,
          height: 400,
        }
      ]
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/favicon.ico",
      other: {
        rel: "apple-touch-icon",
        url: "/favicon.ico",
      },
    },
    appleWebApp: {
      title: `Echord | ${album.title}`,
      statusBarStyle: "black-translucent",
      capable: true,
    },
  };
}

export default async function AlbumLayout({
  children,
  params
}: Readonly<{
  children: ReactNode;
  params: Props['params'];
}>) {
  await connection();

  const id = (await params).id;

  const album = await checkAlbumFromInteraction(id);

  console.log("album", album); // Debugging line

  return (
    <div className="mt-30 w-full h-full relative">
      {children}
    </div>
  );
}
