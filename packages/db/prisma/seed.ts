import { prisma } from "../index";

async function main() {
  console.log("🌱 Seeding DB...");

  const orders = await Promise.all(
    Array.from({ length: 6 }).map((_, i) =>
      prisma.order.create({
        data: {
          price: 500 + i * 300,
          status: i % 2 === 0 ? "COMPLETED" : "PENDING",
          tracking: i % 2 === 0 ? "DELIVERED" : "ON_WAY",
        },
      }),
    ),
  );

  const invoices = await Promise.all(
    orders.map((o) =>
      prisma.invoice.create({
        data: {
          orderId: o.id,
          amount: o.price,
        },
      }),
    ),
  );

  await Promise.all(
    invoices.slice(0, 2).map((inv) =>
      prisma.refund.create({
        data: {
          invoiceId: inv.id,
          status: "COMPLETED",
        },
      }),
    ),
  );

  const convo = await prisma.conversation.create({ data: {} });

  await prisma.message.createMany({
    data: [
      {
        conversationId: convo.id,
        role: "USER",
        data: "Where is my order?",
      },
      {
        conversationId: convo.id,
        role: "AGENT",
        data: "Checking tracking status now.",
      },
      {
        conversationId: convo.id,
        role: "AGENT",
        data: "Your order is on the way.",
      },
    ],
  });

  console.log("✅ Seed complete");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
