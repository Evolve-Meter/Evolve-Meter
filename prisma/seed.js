const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Database...");
  
  // Create a default User with a Meter
  const user = await prisma.user.create({
    data: {
      name: 'Class 5A - Ms. Emily',
      role: 'TEACHER',
      meter: {
        create: {
          meterNumber: 'MTR-DEMO12',
          joulesGenerated: 1250,
          joulesNeeded: 200,
          joulesFulfilled: 140,
        }
      }
    },
    include: { meter: true }
  });

  console.log("Created demo teacher profile. Meter Number: MTR-DEMO12");

  // Create some sample needs (Energy Gaps)
  await prisma.need.createMany({
    data: [
      {
        title: "Calculators for Math Lab",
        description: "Need 5 calculators for students who can't afford them.",
        category: "Learning",
        jouleProxy: 100,
        status: "LOGGED",
        userId: user.id
      },
      {
        title: "Winter Coats (Size M)",
        description: "Two students are coming to school without warm coats.",
        category: "Wellbeing",
        jouleProxy: 140,
        status: "FULFILLED",
        userId: user.id
      },
      {
        title: "Nutritious Snacks",
        description: "Snacks for the afterschool program.",
        category: "Nutrition",
        jouleProxy: 60,
        status: "LOGGED",
        userId: user.id
      }
    ]
  });

  console.log("Seeding complete! You can log in with Meter Number: MTR-DEMO12");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
