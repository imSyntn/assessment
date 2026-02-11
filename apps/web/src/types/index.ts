export interface Conversation {
  id: string;
  createdAt: Date;
  heading: string;
}

export interface dbMessagesType {
  id: string;
  role: "USER" | "AGENT";
  data: string;
  conversationId: string;
  createdAt: Date;
}

export interface dbConversationType {
  id: string;
  heading: string;
  messages: dbMessagesType[];
}
