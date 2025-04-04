import { SessionProvider } from "@/contexts/session";
import { Main } from "../ui/wrappers/Main";
import { Navbar } from "@/components/layout/nav/Navbar";
import { Suspense } from "react";
import Skeleton from "../ui/Skeleton";
import { EInteraction } from "@prisma/client";
import { FeedList, FeedListItem } from "./feed/FeedList";
import { db } from "@/lib/db";
import { FeedItem } from "./feed/Feed";

export async function LayoutContainer({
  sessionId, children, userId, rawFeed
}: {
  sessionId?: string,
  children: React.ReactNode;
  userId: string | undefined,
  rawFeed: EInteraction[];
}) {

  return (
    <div className="w-screen h-screen relative m-0 p-0">
      <Suspense fallback={<Skeleton className="w-full h-full" />}>
        <SessionProvider>
          <Navbar userId={userId} />
          <div className="w-full h-full relative">
            <Main>
              {children}
            </Main>
            <div className="relative xl:absolute xl:top-30 xl:right-0 xl:w-[20rem] flex justify-center items-center w-full">
              <div className="w-full h-full flex flex-col gap-5 items-start justify-center overflow-y-auto xl:max-h-[calc(100vh-10rem)] relative">
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
                                  userId={sessionId || null} />
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
          </div>
        </SessionProvider>
      </Suspense>
    </div>
  )
}
