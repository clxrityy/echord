import {
  deleteInteraction,
  DeleteInteractionProps,
  handleInteraction,
  InteractionProps,
} from '@/app/_actions';
import { db } from '@/lib';
import { Interaction } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { dataType, interactionData, interactionType, userId, sessionId } =
    (await req.json()) as InteractionProps;

  if (
    !dataType ||
    !interactionType ||
    !userId ||
    !sessionId ||
    !interactionData
  ) {
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

    return NextResponse.json(
      {
        interaction: interaction,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error('Error handling interaction:', e);
    return NextResponse.json(
      { error: 'Failed to handle interaction' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { userId, interactionId } =
    (await req.json()) as DeleteInteractionProps;

  if (!userId || !interactionId) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  try {
    await deleteInteraction({
      userId,
      interactionId,
    });

    return NextResponse.json(
      { message: 'Interaction deleted successfully' },
      { status: 200 }
    );
  } catch (e) {
    console.error('Error deleting interaction:', e);
    return NextResponse.json(
      { error: 'Failed to delete interaction' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const interactionId = searchParams.get('id');

  if (!interactionId) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  try {
    const interaction: Interaction = await db.eInteraction.findUnique({
      where: {
        id: interactionId,
      },
      include: {
        user: true,
        eAlbum: true,
        eTrack: true,
        eData: true,
      }
    });

    if (!interaction) {
      return NextResponse.json(
        { error: 'Interaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        interaction,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error('Error fetching interaction:', e);
    return NextResponse.json(
      { error: 'Failed to fetch interaction' },
      { status: 500 }
    );
  }
}
