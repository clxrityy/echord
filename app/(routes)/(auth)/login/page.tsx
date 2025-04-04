import { Login } from "@/components/forms/Login";
import Skeleton from "@/components/ui/Skeleton";
import { handleCurrentSession } from "@/handlers/session"
import Link from "next/link";
import { Suspense } from "react";

export default async function Page() {

  const session = await handleCurrentSession();

  return (
    <div className="w-full h-full mx-auto">
      <div className="flex flex-col w-full h-full mx-auto mt-30 gap-6 items-center justify-center">
        <h2>
          Login
        </h2>
        <Suspense fallback={<Skeleton />}>
          <Login sessionId={session.sessionId} userId={session.userId} />
        </Suspense>
        <Link href={"/signup"} className="text-sm text-gray-400 hover:text-gray-300 transition duration-200 focus:underline">
          Don&#39;t have an account? Sign up here.
        </Link>
      </div>
    </div>
  )
}
