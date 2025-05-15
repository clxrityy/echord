'use client';

import { Suspense } from "react";
import { SaveInteraction } from "./SaveInteraction";
import { FavoriteInteraction } from "./FavoriteInteraction";
import { RatingInteraction } from "./RatingInteraction";

interface Props {
  userId: string;
  trackId: string;
}

export function Interact({ userId, trackId }: Readonly<Props>) {
  return <div className="flex flex-col items-center justify-center gap-5">
    <div className="flex items-center gap-2">
      <Suspense>
        <SaveInteraction
          trackId={trackId}
          userId={userId}
        />
      </Suspense>
      <Suspense>
        <FavoriteInteraction
          trackId={trackId}
          userId={userId}
        />
      </Suspense>
    </div>
    <Suspense>
      <RatingInteraction
        userId={userId}
        trackId={trackId}
      />
    </Suspense>
  </div>
}
