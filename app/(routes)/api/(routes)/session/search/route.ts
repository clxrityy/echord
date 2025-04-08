import { addSearchToUser } from "@/handlers/search";
import { getUserBySessionId } from "@/handlers/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");
  const search = searchParams.get("search");

  if (!search || !sessionId) {
    return NextResponse.json("Missing search or sessionId", { status: 400 });
  }

  const user = await getUserBySessionId(sessionId);

  if (!user) {
    return NextResponse.json("User not authorized", { status: 401 });
  }

  try {
    const newSearch = await addSearchToUser(sessionId, search);

    if (newSearch) {
      return NextResponse.json(newSearch, { status: 200 });
    } else {
      return NextResponse.json("Error creating new search", { status: 500 });
    }

  } catch (e) {
    console.error("Error adding search to user:", e);
    return NextResponse.json("Database error", { status: 500 });
  }
}
