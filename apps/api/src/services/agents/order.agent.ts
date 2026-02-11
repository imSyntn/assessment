import { stepCountIs, streamText } from "ai";
import { model } from "../../lib/ai";
import { AgentContextType } from "../../types";
import {
  getDeliveryStatusTool,
  getOrderByIdTool,
  listOrdersTool,
  orderStatusUpdateTool,
  orderTrackingUpdateTool,
} from "../../tools";
import { prisma } from "@repo/db";

export function runOrderAgent(ctx: AgentContextType) {
  return streamText({
    model,
    system: `You are an Order Support Agent.
      You handle:
      - order status
      - order tracking
      - delivery status
      - order lookup
      - cancellations and modifications
        
      Rules:
      - NEVER guess order data
      - ALWAYS use tools when order data is needed
      - Use the correct tool depending on the question
      - After tool results produce a final helpful answer
      - If order is not found say so clearly
      Be concise and structured.`,
    messages: ctx.messages,
    tools: {
      listOrders: listOrdersTool,
      getOrder: getOrderByIdTool,
      getDeliveryStatus: getDeliveryStatusTool,
      updateOrderStatus: orderStatusUpdateTool,
      updateOrderTracking: orderTrackingUpdateTool,
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
