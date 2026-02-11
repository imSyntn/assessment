import { tool } from "ai";
import { z } from "zod";
import { prisma } from "@repo/db";

export function getOrderInvoices(orderId?: string) {
  return prisma.invoice.findMany({
    where: {
      orderId,
    },
    include: {
      order: true,
      refund: true,
    },
  });
}

export const getInvoiceByIdTool = tool({
  description: "Get a specific invoice by invoice ID",

  inputSchema: z.object({
    invoiceId: z.string(),
  }),

  execute: async ({ invoiceId }) => {
    return prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        order: true,
        refund: true,
      },
    });
  },
});

export const getInvoicesTool = tool({
  description: `
    Get invoices and refund status.
    
    Supports filtering by:
    - orderId
    - refund status (PENDING, COMPLETED, NONE)
    
    Use this tool whenever user asks about invoices or refunds.
    `,

  inputSchema: z.object({
    orderId: z.string().optional(),
    refundStatus: z.enum(["PENDING", "COMPLETED", "NONE"]).optional(),
  }),

  execute: async ({ orderId, refundStatus }) => {
    return prisma.invoice.findMany({
      where: {
        ...(orderId && { orderId }),

        ...(refundStatus === "NONE" && {
          refund: null,
        }),

        ...(refundStatus &&
          refundStatus !== "NONE" && {
            refund: {
              status: refundStatus,
            },
          }),
      },

      include: {
        order: true,
        refund: true,
      },
    });
  },
});
