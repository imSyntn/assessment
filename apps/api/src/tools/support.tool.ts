import { tool } from "ai";
import { z } from "zod";
import { prisma } from "@repo/db";

export const getConversationHistoryTool = tool({
  description: `
    Fetch message history for a conversation.
    
    Use this tool when the user asks about:
    - earlier messages
    - previous answers
    - conversation summary
    - what they said before
    - what the assistant said before
    - chat history
    `,

  inputSchema: z.object({
    conversationId: z.string(),
    limit: z.number().min(1).max(200).optional(),
  }),

  execute: async ({ conversationId, limit }) => {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      take: limit ?? 50,
      select: {
        id: true,
        role: true,
        data: true,
        createdAt: true,
      },
    });

    return messages;
  },
});
