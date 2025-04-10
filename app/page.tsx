import { FeedItem } from "@/components/elements/feed/Feed";
import { FeedList, FeedListItem } from "@/components/elements/feed/FeedList";
import { Hero } from "@/components/elements/Hero";
import { Window } from "@/components/layout/screen/Window";
import Skeleton from "@/components/ui/Skeleton";
import { handleCurrentSession } from "@/handlers/session";
import { db } from "@/lib/db";
import { Suspense } from "react";

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


  return <main className="w-full h-full relative items-center justify-center mx-auto flex flex-col gap-10 mt-26 xl:mt-10 2xl:mt-0 overflow-y-scroll xl:overflow-clip scroll-smooth">
    {/**
     *
     */}
    <div className="w-full h-full xl:h-[90vh] relative flex flex-col xl:flex-row gap-2 items-start justify-start xl:justify-between xl:items-start xl:gap-0">
      <Hero userId={session.userId || undefined} />
      <Suspense fallback={<Skeleton className="w-full h-full" />}>
        <Window sessionId={session.userId || ""}>
          <div className="relative flex justify-center items-center w-full">
            <div className="w-full h-full flex items-start justify-start relative pb-10">
              <FeedList>
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
                      <FeedListItem key={idx}>
                        {
                          interaction && data && interactionData ? (
                            <FeedItem
                              interaction={interaction}
                              data={data}
                              interactionData={interactionData}
                              userId={session.userId || null} />
                          ) : (
                            <Skeleton className="w-full h-20 rounded-md" />
                          )
                        }
                      </FeedListItem>
                    )
                  })
                }
              </FeedList>
            </div>
          </div>
        </Window>
      </Suspense>
    </div>
  </main>;
}
