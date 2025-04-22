"use client";

import { capitalizeFirstLetter } from "@/utils";
import { ReactNode, useState } from "react";

export function Tooltip({
  text,
  children,
}: {
  text: string;
  children: ReactNode;
}) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute top-[calc(100%-55px)] transform-[translateX(-45%)] bg-gray-950/55 text-zinc-100/90 text-sm rounded py-1 px-2 z-10 whitespace-nowrap transition-all duration-200 ease-out font-mono font-semibold tracking-wide">
          {capitalizeFirstLetter(text)}
        </div>
      )}
    </div>
  );
}
