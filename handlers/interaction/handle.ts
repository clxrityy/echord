import { EDataType, EInteraction, EInteractionData, EInteractionType } from '@prisma/client';
import { db } from '@/lib/db';

export interface InteractionProps {
  dataType: EDataType;
  interactionData: Partial<EInteractionData> | EInteractionData;
  interactionType: EInteractionType;
  userId: string;
  sessionId: string;
}

export async function handleInteraction({
  dataType,
  interactionData,
  interactionType,
  userId,
  sessionId,
}: InteractionProps): Promise<EInteraction | undefined> {
    const existingInteraction = await db.eInteraction.findFirst({
      where: {
        userId,
        dataType,
        interactionType,
        eData: {
          interactionData: {
            ...interactionData,
          }
        }
      },
    });

    if (existingInteraction) {
      // If the interaction already exists, we can choose to update it or ignore it
      // For this example, we'll just return early
      return existingInteraction;
    }

    // Create a new interaction

    // check for existing data
    const existingData = await db.eData.findFirst({
      where: {
        dataType,
        interactionData: {
          ...interactionData,
        },
      },
    });

    if (!existingData) {
      // If the data doesn't exist, create it
      const newData = await db.eData.create({
        data: {
          dataType,
          interactionData: {
            create: {
              interactionType,
              ...interactionData,
            }
          },
          session: {
            connectOrCreate: {
              where: {
                userId,
                sessionId,
              },
              create: {
                userId,
                sessionId,
              },
            },
          },
        },
      });

      // Create the interaction with the new data
      const int = await db.eInteraction.create({
        data: {
          interactionType,
          dataId: newData.id,
          userId,
          dataType,
        },
      });

      if (dataType === EDataType.ALBUM && int.albumId && interactionData.imageUrl && interactionData.title && interactionData.artistName) {

        try {
          await db.eAlbum.create({
            data: {
              albumId: int.albumId,
              updatedAt: new Date(),
              eData: {
                connectOrCreate: {
                  where: {
                    id: newData.id,
                  },
                  create: {
                    dataType,
                    interactionData: {
                      create: {
                        interactionType,
                        ...interactionData,
                      }
                    },
                    session: {
                      connectOrCreate: {
                        where: {
                          userId,
                          sessionId,
                        },
                        create: {
                          userId,
                          sessionId,
                        },
                      },
                    },
                  },
                }
              },
              imageUrl: interactionData.imageUrl,
              title: interactionData.title,
              artistName: interactionData.artistName,
            }
          });

          return int;
        } catch (e) {
          console.error('Error creating album:', e);
          throw new Error('Database error');
        }
      }

    } else {
      // If the data already exists, create the interaction with the existing data
      const interaction = await db.eInteraction.create({
        data: {
          interactionType,
          dataId: existingData.id,
          userId,
          dataType,
        },
      });

      try {
        // Update the interaction count
        await db.eInteraction.update({
          where: {
            id: interaction.id,
          },
          data: {
            updatedAt: new Date(),
            eData: {
              connectOrCreate: {
                where: {
                  id: existingData.id,
                },
                create: {
                  dataType,
                  interactionData: {
                    create: {
                      interactionType,
                      ...interactionData,
                    }
                  },
                  session: {
                    connectOrCreate: {
                      where: {
                        userId,
                        sessionId,
                      },
                      create: {
                        userId,
                        sessionId,
                      },
                    },
                  },
                },
              }
            }
          }
        });

        if (dataType === EDataType.ALBUM && interaction.albumId) {
          const existingAlbum = await db.eAlbum.findFirst({
            where: {
              albumId: interaction.albumId,
            }
          });

          if (existingAlbum) {
            await db.eAlbum.update({
              where: {
                id: existingAlbum.id,
              },
              data: {
                updatedAt: new Date(),
                eData: {
                  connectOrCreate: {
                    where: {
                      id: existingData.id,
                    },
                    create: {
                      dataType,
                      interactionData: {
                        create: {
                          interactionType,
                          ...interactionData,
                        }
                      },
                      session: {
                        connectOrCreate: {
                          where: {
                            userId,
                            sessionId,
                          },
                          create: {
                            userId,
                            sessionId,
                          },
                        },
                      },
                    },
                  }
                }
              }
            });

            return interaction;
          } else if (interaction.albumId && interactionData.imageUrl && interactionData.title && interactionData.artistName) {
            await db.eAlbum.create({
              data: {
                albumId: interaction.albumId,
                updatedAt: new Date(),
                eData: {
                  connectOrCreate: {
                    where: {
                      id: existingData.id,
                    },
                    create: {
                      dataType,
                      interactionData: {
                        create: {
                          interactionType,
                          ...interactionData,
                        }
                      },
                      session: {
                        connectOrCreate: {
                          where: {
                            userId,
                            sessionId,
                          },
                          create: {
                            userId,
                            sessionId,
                          },
                        },
                      },
                    },
                  }
                },
                imageUrl: interactionData.imageUrl,
                title: interactionData.title,
                artistName: interactionData.artistName,
              }
            })
          }
        }

        return interaction;
      } catch (e) {
        console.error('Error updating interaction:', e);
        throw new Error('Database error');
      }
    }
}
