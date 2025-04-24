import { db } from '@/lib';
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
