import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
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

  await prisma.user.create({
    data: {
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
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
