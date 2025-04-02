import Skeleton from "@/components/ui/Skeleton";
import { db } from "@/lib/db";
import { Link } from "lucide-react";
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
        <Link href={`/profile/${userId}`} className="flex flex-col md:flex-row items-center justify-start gap-2 focus:text-blue-400 transition">
          {
            avatar && (
              <ImageComponent src={avatar} alt={username} className="w-10 h-10 rounded-full" />
            )
          }
          <h5 className="text-sm lg:text-base hover:underline transition underline-offset-2">{username}</h5>
        </Link>
      </div>
    )
  }

  return (
    <Skeleton className="w-20 h-20 rounded-full" />
  )
}
