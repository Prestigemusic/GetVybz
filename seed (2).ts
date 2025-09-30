import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.upsert({
    where: { email: "demo1@getvybz.com" },
    update: {},
    create: {
      email: "demo1@getvybz.com",
      password: "password",
      profile: {
        create: {
          fullName: "Demo User One",
          bio: "Musician | DJ",
          avatarUrl: "https://placehold.co/100x100",
        },
      },
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "demo2@getvybz.com" },
    update: {},
    create: {
      email: "demo2@getvybz.com",
      password: "password",
      profile: {
        create: {
          fullName: "Demo User Two",
          bio: "Performer | Artist",
          avatarUrl: "https://placehold.co/100x100",
        },
      },
    },
  });

  await prisma.booking.createMany({
    data: [
      {
        userId: user1.id,
        artistId: user2.id,
        status: "pending",
        date: new Date(),
        details: "Booking Demo2 for event on Friday",
      },
      {
        userId: user2.id,
        artistId: user1.id,
        status: "confirmed",
        date: new Date(),
        details: "Booking Demo1 for Saturday show",
      },
    ],
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
