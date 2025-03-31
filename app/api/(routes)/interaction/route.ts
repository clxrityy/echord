import { handleInteraction, InteractionProps } from '@/handlers/interaction';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { dataType, interactionData, interactionType, userId, sessionId } =
    (await req.json()) as InteractionProps;

  console.log('Received interaction:', {
    dataType,
    interactionData,
    interactionType,
    userId,
    sessionId,
  });

  if (!dataType || !interactionType || !userId || !sessionId || !interactionData) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  try {
    const interaction = await handleInteraction({
      dataType,
      interactionData: {
        ...interactionData,
      },
      interactionType,
      userId,
      sessionId,
    });
    if (!interaction) {
      return NextResponse.json(
        { error: 'Failed to create or update interaction' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      interaction: interaction,
    }, { status: 200 });
  } catch (e) {
    console.error('Error handling interaction:', e);
    return NextResponse.json(
      { error: 'Failed to handle interaction' },
      { status: 500 }
    );
  }
}
