import { checkTrackFromInteraction } from "@/app/_actions";
import { Metadata } from "next";
import { connection } from "next/server";
import { ReactNode } from "react";

type Props = {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;

  const track = await checkTrackFromInteraction(id);

  if (!track) {
    return {
      title: "Track not found",
      description: "Track not found",
    };
  }

  return {
    title: `${track.title} by ${track.artistName}`,
    keywords: [
      "Echord",
      "Track",
      "Music",
      "Music Track",
      `${track.title}`,
      `${track.artistName}`,
      `${track.title} by ${track.artistName}`,
      `${track.artistName} Track`,
      `${track.title} Track`,
      `${track.title} by ${track.artistName} Track`,
      `${track.title} by ${track.artistName} Music`,
      `${track.artistName} Music`,
    ],
    description: `${track.title} by ${track.artistName}`,
    openGraph: {
      title: track.title,
      description: `${track.title} by ${track.artistName}`,
      url: `https://echord.uk/track/${id}`,
    },
    twitter: {
      title: track.title,
      description: `${track.title} by ${track.artistName}`,
      card: "summary",
      images: [
        {
          url: track.imageUrl!,
          alt: `${track.title} by ${track.artistName}`,
          width: 400,
          height: 400,
        },
      ],
    },
    icons: {
      icon: track.imageUrl!,
      shortcut: track.imageUrl!,
      apple: track.imageUrl!,
    },
    alternates: {
      canonical: `https://echord.uk/track/${id}`,
    },
    metadataBase: new URL("https://echord.uk"),
    robots: {
      index: true,
      follow: true,
      nocache: false,
      noarchive: false,
      noimageindex: false,
      notranslate: false,
    },
    appleWebApp: {
      title: `Echord | ${track.title}`,
      statusBarStyle: "black-translucent",
      capable: true,
    },
  };
}

export default async function TrackLayout({
  children,
}: {
  children: ReactNode;
}) {
  await connection();

  return (
    <div className="w-full h-full mt-30 relative">
      {children}
    </div>
  );
}
