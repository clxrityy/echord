import { ReactNode } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for Echord',
}

export default async function TermsLayout({
  children,
  privacy,
}: {
  children: ReactNode;
  privacy: ReactNode;
}) {
  return (
    <div className="flex flex-col items-start justify-start w-full h-full gap-4 px-4 py-8 mx-auto max-w-6xl max-h-[calc(100vh-4rem)] overflow-y-auto overflow-clip scroll-smooth mt-30">
      {children}
      {privacy}
    </div>
  )
}
