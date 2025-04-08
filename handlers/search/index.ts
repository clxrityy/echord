import { db } from "@/lib/db";
import { getUserBySessionId } from "../user";

export async function addSearchToUser(sessionId: string, search: string) {
  const user = await getUserBySessionId(sessionId);

  if (!user) {
    return undefined;
  }

  const userWithSearches = await db.eUser.findUnique({
    where: {
      id: user.id
    },
    include: {
      searches: true,
    }
  });

  if (!userWithSearches) {
    return undefined;
  }

  const doesSearchExist = userWithSearches.searches.some((s) => s.searchQuery === search);

  if (!doesSearchExist) {
    try {
      const newSearch = await db.eSearch.create({
        data: {
          searchQuery: search,
          userId: user.userId,
        }
      });

      if (newSearch) {
        await db.eUser.update({
          where: {
            id: user.id,
          },
          data: {
            searches: {
              connect: {
                id: newSearch.id,
              },
            },
            updatedAt: new Date(),
          },
        });
        return newSearch;
      } else {
        console.error('Error creating new search:', newSearch);
        throw new Error('Database error');
      }

    } catch (e) {
      console.error('Error adding search to user:', e);
      throw new Error('Database error');
    }
  }
}
