import { useState, useEffect, useRef, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useConversations } from "../hooks/use-conversations";
import { ScrollArea } from "@repo/ui/components";
import { Loader2Icon } from "lucide-react";
import { dbConversationType, dbMessagesType } from "../types";
import { EmptyState } from "./EmptyState";
import { MessageBox } from "./MessageBox";
import { TypingIndicator } from "./TypingIndicator";
import { UserInput } from "./UserInput";
import { HealthStatus } from "./HealthStatus";

export const ConversationDetails = ({
  conversationId,
}: {
  conversationId: string;
}) => {
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [conversationName, setConversationName] = useState(
    "Start a new conversation",
  );
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const { fetchMessages, fetchConversations } = useConversations();

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "http://localhost:3000/api/chat/messages",
        body: { conversationId },
      }),
    [conversationId],
  );

  const { messages, sendMessage, setMessages, status, error } = useChat({
    transport,
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    setMessagesLoading(true);
    fetchMessages(conversationId)
      .then((data) => {
        if (!data) return;

        const { messages, heading } = data;

        setMessages(
          messages.map((m) => ({
            id: m.id,
            role: m.role === "USER" ? "user" : "assistant",
            parts: [{ type: "text", text: m.data }],
          })),
        );

        setConversationName(heading);
      })
      .finally(() => {
        setMessagesLoading(false);
      });
  }, [conversationId]);

  useEffect(() => {
    const el = endRef.current;
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    await sendMessage({
      role: "user",
      parts: [{ type: "text", text: input }],
    });
    setInput("");
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <div className="border-b p-4 flex justify-between items-center">
        <div className="">
          <h1 className="text-xl font-semibold">Customer Support Chat</h1>
          <p className="text-sm text-muted-foreground">{conversationName}</p>
        </div>
        <HealthStatus />
      </div>
      <ScrollArea className="flex-1 min-h-0 p-4">
        {messagesLoading ? (
          <div className="grid place-items-center min-h-[60vh]">
            <Loader2Icon className="h-8 w-8 animate-spin" />
          </div>
        ) : messages?.length === 0 ? (
          <div className="grid place-items-center min-h-[60vh]">
            <EmptyState />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            {messages?.map((m) => <MessageBox key={m.id} m={m} />)}

            {isLoading && <TypingIndicator />}

            {error && (
              <div className="mx-4 mt-4 rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
                ⚠️ Chat error: {error.message || "Something went wrong"}
              </div>
            )}

            <div ref={endRef} />
          </div>
        )}
      </ScrollArea>

      <UserInput
        handleSubmit={handleSubmit}
        input={input}
        setInput={setInput}
        isLoading={isLoading}
      />
    </div>
  );
};
