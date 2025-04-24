export async function fetchRatingInteraction({
  dataId,
  userId,
}: {
  dataId: string;
  userId: string;
}) {
  const response = await fetch(
    `/api/interaction/rate?dataId=${dataId}&userId=${userId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  const { interaction } = (await response.json()) as {
    interaction: { interactionData: { rating: number } };
  };

  if (!interaction) {
    return null;
  }
  if (!interaction.interactionData) {
    return null;
  }
  if (!interaction.interactionData.rating) {
    return null;
  }

  return interaction.interactionData.rating;
}
