import { handleInteraction, InteractionProps } from "@/handlers/interaction";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { dataType, data, interactionType, userId, sessionId } = await req.json() as InteractionProps;

  if (!dataType || !data || !interactionType || !userId || !sessionId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const interaction = await handleInteraction({ dataType, data, interactionType, userId, sessionId });
    if (!interaction) {
      return NextResponse.json({ error: "Failed to create or update interaction" }, { status: 500 });
    }

    return NextResponse.json(interaction, { status: 200 });

  } catch (e) {
    console.error("Error handling interaction:", e);
    return NextResponse.json({ error: "Failed to handle interaction" }, { status: 500 });
  }
}
