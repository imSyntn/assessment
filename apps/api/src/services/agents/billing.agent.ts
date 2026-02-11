import { stepCountIs, streamText } from "ai";
import { model } from "../../lib/ai";
import { getInvoiceByIdTool, getInvoicesTool } from "../../tools";
import { prisma } from "@repo/db";
import { AgentContextType } from "../../types";

export function runBillingAgent(ctx: AgentContextType) {
  return streamText({
    model,

    system: `
      You are a Billing Support Agent.
        
      You handle:
      - invoices
      - payments
      - charges
      - refunds
      - refund status
        
      Rules:
      - NEVER guess billing data.
      - ALWAYS use billing tools when invoice or refund data is needed.
      - Convert the user question into correct tool parameters.
      - If user asks:
        - "all invoices" → call tool without filters
        - "refund pending" → refundStatus=PENDING
        - "refund completed" → refundStatus=COMPLETED
        - "no refund" → refundStatus=NONE
        - specific order → include orderId
        
      After tool results:
      - Summarize clearly
      - Use bullet points when listing
      - Say when no records are found
      `,

    messages: ctx.messages,

    tools: {
      getInvoices: getInvoicesTool,
      getInvoiceById: getInvoiceByIdTool,
    },

    toolChoice: "auto",

    stopWhen: stepCountIs(5),

    onFinish: async ({ text }) => {
      await prisma.message.create({
        data: {
          conversationId: ctx.conversationId,
          role: "AGENT",
          data: text,
        },
      });
    },
  });
}
