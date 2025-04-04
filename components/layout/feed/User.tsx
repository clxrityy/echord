import Skeleton from "@/components/ui/Skeleton";
import { db } from "@/lib/db";
import Link from "next/link";
import ImageComponent from "next/image";

export async function FeedUser({ userId }: { userId: string }) {
  const user = await db.eUser.findFirst({
    where: {
      userId: userId,
    }
  });

  if (user) {
    const { username, avatar } = user;

    return (
      <div className="w-fit h-fit flex items-center justify-start flex-col gap-2">
        <Link href={`/profile/${userId}`} className="focus:text-blue-400 transition">
          { username && (
            <div className="flex flex-col md:flex-row items-center justify-start gap-2">
              { avatar && <ImageComponent fetchPriority="low" src={avatar} alt={username} className="w-10 h-10 rounded-full" width={20} height={20} /> }
              <p className="text-sm lg:text-base hover:underline transition underline-offset-2">{username}</p>
            </div>
          )
        }
        </Link>
      </div>
    )
  }

  return (
    <Skeleton className="w-20 h-20 rounded-full" />
  )
}
