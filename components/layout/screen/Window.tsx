"use client";
import Skeleton from "@/components/ui/Skeleton";
import { useSession } from "@/contexts/session";
import { useWindow, WindowProvider } from "@/contexts/window";
import { useScreenSize } from "@/hooks/useScreenSize";
import { ReactNode, Suspense, useEffect } from "react";
import { Toaster } from "react-hot-toast";

type WindowProps = {
  sessionId: string;
  children: ReactNode;
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
    if (sessionId && (sessionId !== getSessionId())) {
      setSessionId(sessionId);
    }
  }, [sessionId]);

  return (
    <div className="w-full h-screen flex justify-end mt-20">
      <Suspense fallback={<Skeleton className="w-full h-full" />}>
        <WindowProvider>
          <Toaster position="top-right" toastOptions={{
            custom: {
              className: 'bg-gray-900 text-gray-200 shadow-md rounded-lg border border-gray-700/50',
              style: {
                background: '#0f2862',
                color: '#e5e7eb',
                fontSize: '0.875rem',
                padding: '1rem',
                zIndex: 9999,
              },
            },
            success: {
              duration: 3000,
              style: {
                background: '#3b82f6',
                color: '#ffffff',
                fontSize: '0.875rem',
                padding: '1rem',
              },
            },
            error: {
              duration: 3000,
              style: {
                background: '#9e363a',
                color: '#ffffff',
                fontSize: '0.875rem',
                padding: '1rem',
              },
            },
            loading: {
              duration: 3000,
              style: {
                background: '#4f5f76',
                color: '#ffffff',
                fontSize: '0.875rem',
                padding: '1rem',
              },
            },
          }} />
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
