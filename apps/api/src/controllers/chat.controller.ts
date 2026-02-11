import { prisma } from "@repo/db";
import { Context } from "hono";
import { ApiError } from "../lib/error";
import { handleChat } from "../services";

export const getConversations = async (c: Context) => {
  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (conversations.length === 0) {
      throw new ApiError("No conversations found", 404);
    }

    c.status(200);
    return c.json({
      data: conversations,
    });
  } catch (error) {
    throw error;
  }
};

export const getConversationsById = async (c: Context) => {
  const id = c.req.param("id");
  if (!id) {
    throw new ApiError("ID is required.", 404);
  }
  try {
    const conversation = await prisma.conversation.findFirst({
      where: {
        id,
      },
      include: {
        messages: true,
      },
    });

    if (!conversation) {
      throw new ApiError("Conversation not found", 404);
    }

    c.status(200);
    return c.json({
      data: conversation,
    });
  } catch (error) {
    throw error;
  }
};

export const deleteConversations = async (c: Context) => {
  const id = c.req.param("id");
  if (!id) {
    throw new ApiError("ID is required.", 404);
  }
  try {
    const conversation = await prisma.conversation.findFirst({
      where: {
        id,
      },
    });

    if (!conversation) {
      throw new ApiError("Conversation not found", 404);
    }

    await prisma.conversation.delete({
      where: {
        id,
      },
    });

    c.status(200);
    return c.json({
      msg: "Conversation deleted successfully",
    });
  } catch (error) {
    throw error;
  }
};

export const postMessage = async (c: Context) => {
  const body = await c.req.json();
  const last = body.messages?.at(-1);

  const isFirstMessage = body.messages.length === 1;
  console.log(isFirstMessage);

  const text =
    last?.parts
      ?.filter((p: any) => p.type === "text")
      .map((p: any) => p.text)
      .join("") ?? "";

  const input = {
    conversationId: body.conversationId,
    message: text,
    isFirstMessage: isFirstMessage,
  };

  const { stream } = await handleChat(input);

  return stream.toUIMessageStreamResponse();
};

export const createConversation = async (c: Context) => {
  try {
    const conversation = await prisma.conversation.create({
      data: {
        heading: "-",
      },
    });

    console.log(conversation);

    c.status(200);
    return c.json({
      data: conversation.id,
    });
  } catch (error) {
    throw error;
  }
};
