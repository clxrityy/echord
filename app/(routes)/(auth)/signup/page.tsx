import { Signup } from "@/components/elements/forms/Signup";
import Skeleton from "@/components/ui/Skeleton";
import { handleCurrentSession } from "@/handlers/session";
import { Suspense } from "react";

export default async function Page() {
  const session = await handleCurrentSession();

  return (
    <div className="h-full w-full mx-auto">
      <div className="flex flex-col w-full h-full mx-auto mt-30 gap-6 items-center justify-center">
        <h2>
          Sign Up
        </h2>
        <Suspense fallback={<Skeleton />}>
          <Signup sessionId={session.sessionId} userId={session.userId} />
        </Suspense>
      </div>
    </div>
  )
}
