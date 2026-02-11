import { tool } from "ai";
import { z } from "zod";
import { prisma } from "@repo/db";

// async function getOrdersWithTotal() {
//   const [orders, agg] = await Promise.all([
//     prisma.order.findMany({
//       include: {
//         invoice: {
//           include: { refund: true },
//         },
//       },
//       orderBy: { createdAt: "desc" },
//     }),

//     prisma.order.aggregate({
//       _sum: {
//         price: true,
//       },
//     }),
//   ]);

//   console.log({
//     orders,
//     totalSpent: agg._sum.price ?? 0,
//     orderCount: orders.length,
//   });

//   return {
//     orders,
//     totalSpent: agg._sum.price ?? 0,
//     orderCount: orders.length,
//   };
// }

export const listOrdersTool = tool({
  description: "List all orders with status and tracking info",

  inputSchema: z.object({}),

  execute: async () => {
    return prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        invoice: true,
      },
    });
  },
});

export const getOrderByIdTool = tool({
  description: "Get full details for a specific order",

  inputSchema: z.object({
    orderId: z.string(),
  }),

  execute: async ({ orderId }) => {
    return prisma.order.findUnique({
      where: { id: orderId },
      include: {
        invoice: { include: { refund: true } },
      },
    });
  },
});

export const getDeliveryStatusTool = tool({
  description: "Get delivery/tracking status for an order",

  inputSchema: z.object({
    orderId: z.string(),
  }),

  execute: async ({ orderId }) => {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        status: true,
        tracking: true,
      },
    });

    return order;
  },
});

export const orderStatusUpdateTool = tool({
  description: "Update order status",

  inputSchema: z.object({
    orderId: z.string(),
    status: z.enum(["PENDING", "COMPLETED", "FAILED", "CANCELLED", "RETURNED"]),
  }),

  execute: async ({ orderId, status }) => {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
      },
      select: {
        id: true,
        status: true,
        tracking: true,
      },
    });

    return order;
  },
});

export const orderTrackingUpdateTool = tool({
  description: "Update order tracking",

  inputSchema: z.object({
    orderId: z.string(),
    tracking: z.enum(["ON_WAY", "DELIVERED", "RETURNED"]),
  }),

  execute: async ({ orderId, tracking }) => {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        tracking,
      },
      select: {
        id: true,
        status: true,
        tracking: true,
      },
    });

    return order;
  },
});
