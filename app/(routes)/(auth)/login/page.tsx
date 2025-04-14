import { Login } from "@/components/elements/forms/Login";
import { Window } from "@/components/layout/screen/Window";
import Skeleton from "@/components/ui/Skeleton";
import { handleCurrentSession } from "@/app/_handlers/session"
import Link from "next/link";
import { Suspense } from "react";

export default async function Page() {

  const session = await handleCurrentSession();

  return (
    <Suspense fallback={<Skeleton className="w-full h-full" />}>
      <Window sessionId={session.sessionId || ""}>
        <div className="w-full h-full mx-auto flex items-center justify-start">
          <div className="flex flex-col w-full h-full mx-auto gap-6 items-center justify-center">
            <h2>
              Login
            </h2>
            <Suspense fallback={<Skeleton />}>
              <Login sessionId={session.sessionId} userId={session.userId} />
            </Suspense>
            <Link href={"/signup"} className="text-sm text-gray-300 hover:text-gray-200/80 transition duration-200 focus:underline">
              Don&#39;t have an account? Sign up here.
            </Link>
          </div>
        </div>
      </Window>
    </Suspense>
  )
}
