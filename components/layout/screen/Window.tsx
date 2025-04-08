"use client";
import Skeleton from "@/components/ui/Skeleton";
import { useSession } from "@/contexts/session";
import { useWindow, WindowProvider } from "@/contexts/window";
import { useScreenSize } from "@/hooks/useScreenSize";
import { Suspense, useEffect } from "react";

type WindowProps = {
  sessionId: string;
  children: React.ReactNode;
}

export const Window = (
  { sessionId, children }: WindowProps
) => {
  const { setWindowSize, getWindowSize } = useWindow();
  const { width, height } = useScreenSize();
  const { setSessionId, getSessionId } = useSession();


  useEffect(() => {
    if (getWindowSize().width !== width || getWindowSize().height !== height) {
      setWindowSize(width, height);
      console.log(getWindowSize())
    }
  }, [width, height]);

  useEffect(() => {
    if (sessionId !== getSessionId()) {
      setSessionId(sessionId);
    }
  }, [sessionId]);

  return (
    <div className="w-full h-screen flex justify-end mt-20">
      <Suspense fallback={<Skeleton className="w-full h-full" />}>
        <WindowProvider>
          <div className="w-full h-full flex items-start justify-center relative">
            <div className="w-full h-full flex items-start justify-end relative max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </WindowProvider>
      </Suspense>
    </div>
  )
}
