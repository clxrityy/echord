import { getUserBySessionId } from "@/app/_actions";
import Loading from "@/app/loading";
import { LogoutButton } from "@/components/elements/forms/Logout";
import { Window } from "@/components/layout/screen/Window";
import Skeleton from "@/components/ui/Skeleton";
import { getUserSessionId } from "@/lib";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Page() {

  const sessionId = await getUserSessionId();

  if (!sessionId) {
    return redirect("/login");
  }

  const user = await getUserBySessionId(sessionId);

  if (!user) {
    return redirect("/login");
  }


  return (
    <Suspense fallback={<Loading />}>
      <Window sessionId={sessionId}>
        <div className="flex flex-col items-center justify-center h-full gap-8 w-full">
          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold">Logout of {user?.username}?</h1>
            <p className="text-sm text-gray-500">
              You will be logged out of your account and redirected to the login page.
            </p>
          </div>
          <Suspense fallback={<Skeleton className="w-1/3 animate-pulse h-8" />}>
            <LogoutButton />
          </Suspense>
        </div>
      </Window>
    </Suspense>
  )
}
