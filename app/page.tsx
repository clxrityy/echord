import { FeedItem } from "@/components/elements/Feed";
import Skeleton from "@/components/ui/Skeleton";
import { handleCurrentSession } from "@/handlers/session";
import { db } from "@/lib/db";

export default async function Home() {

  const session = await handleCurrentSession();

  const rawFeed = await db.eInteraction.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      interactionType: {
        notIn: ["UNFOLLOWED", "FOLLOWED"],
      },
    }
  });


  return <main className="w-full h-full relative mt-40 items-center justify-center mx-auto flex flex-col gap-10">
    {/**
     * FEED
     */}
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2 items-start justify-center overflow-y-scroll relative">
      {
        rawFeed.map(async (item, idx) => {
          const { ...interaction } = item;
          const { ...data } = await db.eData.findUnique({
            where: {
              id: item.dataId,
            }
          });
          const { ...interactionData } = await db.eInteractionData.findFirst({
            where: {
              dataId: item.dataId,
            }
          });

          return (
            <div key={idx} className="w-full relative flex items-center justify-center">
              <div className="w-5/6 lg:w-3/4 h-full flex flex-col gap-5 items-start justify-center">
                <div className="w-full h-full flex items-center justify-center py-10 px-4">
                  {
                    interaction && data && interactionData ? (
                      <FeedItem
                        interaction={interaction}
                        data={data}
                        interactionData={interactionData}
                        userId={session?.userId || null} />
                    ) : (
                      <Skeleton className="w-full h-20 rounded-md" />
                    )
                  }
                </div>
              </div>
            </div>
          )
        })
      }
    </div>
    {
      /**
       * SOMETHING ELSE
       */
    }
  </main>;
}
