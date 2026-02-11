import { useState, useCallback } from "react";
import { honoClient } from "../../lib/api";
import { toast } from "sonner";
import type { Conversation, dbConversationType } from "../types";
import { useNavigate } from "react-router-dom";

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchConversations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await (honoClient as any).chat.conversations.$get();
      const data = (await res.json()) as { data: Conversation[] };
      setConversations(data.data || []);
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteConversation = useCallback(
    async (id: string, activeConversationId: string | null) => {
      const toastId = toast.loading("Deleting conversation...");
      try {
        await (honoClient as any).chat.conversations[":id"].$delete({
          param: { id } as { id: string },
        });
        setConversations((prev) => prev.filter((c) => c.id !== id));
        toast.success("Conversation deleted successfully", { id: toastId });
        if (activeConversationId === id) navigate("/");
      } catch (err) {
        console.error("Failed to delete conversation:", err);
        toast.error("Failed to delete conversation", { id: toastId });
      }
    },
    [],
  );

  const fetchMessages = useCallback(
    async (conversationId: string): Promise<dbConversationType | null> => {
      try {
        const res = await (honoClient as any).chat.conversations[":id"].$get({
          param: { id: conversationId },
        });

        const { data } = await res.json();
        return data;
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        return null;
      }
    },
    [],
  );

  const createNewConversation = useCallback(async () => {
    const toastId = toast.loading("Creating conversation...");
    try {
      const response = await (honoClient as any).chat.conversations.new.$get();
      const { data } = await response.json();
      navigate(`/chat/${data}`);
      toast.success("Conversation created successfully", { id: toastId });
      fetchConversations();
    } catch (err) {
      toast.error("Failed to create conversation", { id: toastId });
    }
  }, []);

  const selectConversation = useCallback((id: string) => {
    navigate(`/chat/${id}`);
  }, []);

  return {
    conversations,
    loading,
    fetchConversations,
    deleteConversation,
    fetchMessages,
    createNewConversation,
    selectConversation,
  };
}
