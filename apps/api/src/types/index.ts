import { Role } from "@repo/db/generated/prisma/enums";

interface messageBodyType {
  role: "user" | "assistant";
  content: string;
  id: string;
}

export interface RequestBodyType {
  message: string;
  conversationId: string;
  isFirstMessage: boolean;
}

export interface dbMessagesType {
  role: Role;
  data: string;
  id: string;
  conversationId: string;
  createdAt: Date;
}

interface dbConversationType {
  id: string;
  heading: string;
  messages: dbMessagesType[];
}

export interface AgentMessageType {
  role: "user" | "assistant";
  content: string;
}

export interface AgentContextType {
  messages: AgentMessageType[];
  conversationId: string;
}
