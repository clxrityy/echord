import { Settings } from "@/components/elements/Settings";
import Skeleton from "@/components/ui/Skeleton";
import { handleCurrentSession } from "@/handlers/session";
import { db } from "@/lib/db";
import { ICONS } from "@/utils/constants";
import { Suspense } from "react";

type Props = {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: Props) {
  const id = (await params).id;

  const profileUser = await db.eUser.findFirst({
    where: {
      userId: id
    },
    include: {
      sessions: true,
      interactions: true,
    }
  });

  const session = await handleCurrentSession();

  const isCurrentUser = session.userId === profileUser?.userId;

  if (!profileUser) {
    return <h1 className="mt-30">User not found</h1>;
  }

  return (
    <div className="w-full h-full relative mt-30">
      <div className="w-full flex flex-col gap-4">
        <div className="flex items-center justify-start gap-2 w-fit">
          {
            isCurrentUser && (
              <Suspense fallback={<Skeleton />}>
                <Settings sessionId={session.sessionId} userId={profileUser.userId} />
              </Suspense>
            )
          }
          <div className="flex flex-row items-center gap-2">
            <h1 className="text-2xl font-bold">{profileUser.username}</h1>
          </div>
        </div>
        <div className="">

        </div>
      </div>
    </div>
  );
}
