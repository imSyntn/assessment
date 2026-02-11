import { stepCountIs, streamText } from "ai";
import { model } from "../../lib/ai";
import { prisma } from "@repo/db";
import { getConversationHistoryTool } from "../../tools";

export function runSupportAgent(ctx: any) {
  return streamText({
    model,
    system: `
      You are a friendly and professional Support Agent.

      Your job is to help users with:
      - general questions
      - FAQs
      - troubleshooting
      - how-to guidance
      - product usage help

      Rules:
      - Be polite and clear
      - If question depends on past chat context use the conversation history tool.
      - If user refers to earlier messages fetch history before answering.
      - If you don't know something say so
      - Keep answers concise but helpful
    `,
    messages: ctx.messages,
    tools: {
      getConversationHistory: getConversationHistoryTool,
    },

    toolChoice: "auto",

    stopWhen: stepCountIs(4),

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
