import { handleCurrentSession } from "@/handlers/session";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {

  const session = await handleCurrentSession();

  const feed = await db.eInteraction.findMany({
    orderBy: {
      createdAt: "desc",
    }
  });

  
  return <main className="w-full h-full relative mt-20">

  </main>;
}
