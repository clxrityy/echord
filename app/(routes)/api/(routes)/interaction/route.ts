import { db, getUserSessionId } from '@/lib';
import { Interaction } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const interactionId = searchParams.get('id');

  if (!interactionId) {
    return NextResponse.json(
      {
        error: 'Interaction ID is required',
      },
      { status: 400 }
    );
  }

  const interaction = await db.eInteraction.findUnique({
    where: {
      id: interactionId,
    },
    include: {
      eAlbum: true,
      eTrack: true,
      user: true,
      eData: true,
    },
  });

  if (!interaction) {
    return NextResponse.json(
      {
        error: 'Interaction not found',
      },
      { status: 404 }
    );
  }

  const interactionData = await db.eInteractionData.findUnique({
    where: {
      dataId: interaction.dataId,
    },
  });

  const data: Interaction = {
    ...interaction,
    interactionData: interactionData,
  };

  return NextResponse.json(
    {
      interaction: data,
    },
    { status: 200 }
  );
}

export async function DELETE(req: NextRequest) {
  const sessionId = await getUserSessionId();

  if (!sessionId) {
    return NextResponse.json(
      {
        error: 'Unauthorized',
      },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);

  const interactionId = searchParams.get('interactionId');
  const userId = searchParams.get('userId');

  if (!interactionId || !userId) {
    return NextResponse.json(
      {
        error: 'Interaction ID and User ID are required',
      },
      { status: 400 }
    );
  }

  const existing = await db.eInteraction.findFirst({
    where: {
      dataId: interactionId,
      userId: userId,
    },
  });

  if (!existing) {
    return NextResponse.json(
      {
        error: 'Interaction not found',
      },
      { status: 404 }
    );
  }

  
  try {
    await db.eInteraction.delete({
      where: {
        id: existing.id,
      },
    });

    await db.eInteractionData.delete({
      where: {
        dataId: existing.dataId,
      },
    });
  } catch (e) {
    console.error('Error deleting interaction:', e);
    return NextResponse.json(
      {
        error: 'Failed to delete interaction',
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      message: 'Interaction deleted successfully',
    },
    { status: 200 }
  );
}
