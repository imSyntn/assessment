import { prisma } from "@repo/db";
import { AgentMessageType, dbMessagesType, RequestBodyType } from "../types";
import { classifyIntent } from "./agentRouter.service";
import { runOrderAgent } from "./agents/order.agent";
import { runBillingAgent } from "./agents/billing.agent";
import { runSupportAgent } from "./agents/support.agent";

function toAIMessages(dbMsgs: dbMessagesType[]): AgentMessageType[] {
  return dbMsgs.map((m: dbMessagesType) => ({
    role: m.role === "USER" ? "user" : "assistant",
    content: m.data,
  }));
}

export function getConversationMessages(conversationId: string) {
  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
  });
}

export async function handleChat(input: RequestBodyType) {
  const { conversationId, message, isFirstMessage } = input;

  if (!message || message.trim().length === 0) {
    throw new Error("Message is required");
  }

  if (isFirstMessage) {
    const data = await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        heading: message.slice(0, 60),
      },
    });
    console.log(data);
  }
  await prisma.message.create({
    data: {
      conversationId,
      role: "USER",
      data: message,
    },
  });

  const history = await getConversationMessages(conversationId);
  const messages: AgentMessageType[] = toAIMessages(history);

  const intent = await classifyIntent(message);
  console.log(intent);

  const ctx = { messages, conversationId };

  if (intent === "order") return { stream: runOrderAgent(ctx) };
  if (intent === "billing") return { stream: runBillingAgent(ctx) };

  return { stream: runSupportAgent(ctx) };
}
