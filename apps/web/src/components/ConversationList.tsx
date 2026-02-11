import { Button } from "@repo/ui/components/button";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { Trash2, Plus, MessageSquare } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";
import { useConversations } from "../hooks/use-conversations";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const ConversationList = ({
  activeConversationId,
}: {
  activeConversationId: string | null;
}) => {
  const navigate = useNavigate();
  const {
    conversations,
    loading,
    deleteConversation,
    fetchConversations,
    createNewConversation,
    selectConversation,
  } = useConversations();

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return (
    <aside className="w-80 border-r bg-muted/30 flex flex-col min-h-0">
      <div className="p-4 border-b shrink-0">
        <Button
          onClick={createNewConversation}
          className="w-full"
          disabled={loading}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Conversation
        </Button>
      </div>
      <ScrollArea className="flex-1 min-h-0 p-2 w-full">
        {loading && conversations.length === 0 && (
          <EmptyList text="Loading conversations..." />
        )}

        {!loading && conversations.length === 0 && (
          <EmptyList text="No conversations yet" sub="Start a new one" />
        )}

        {conversations.map((c) => {
          const isActive = c.id === activeConversationId;

          return (
            <div
              key={c.id}
              onClick={() => selectConversation(c.id)}
              className={cn(
                "group rounded-lg p-3 mb-2 cursor-pointer transition hover:bg-muted",
                isActive && "border-2 border-accent-foreground",
              )}
            >
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {c.heading ? c.heading.slice(0, 20) : "New conversation"}
                  </p>

                  <p className="text-xs text-muted-foreground truncate">
                    {formatDate(c.createdAt)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 h-8 w-8 flex-none shrink-0 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversation(c.id, activeConversationId);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          );
        })}
      </ScrollArea>
    </aside>
  );
};

function EmptyList({ text, sub }: { text: string; sub?: string }) {
  return (
    <div className="text-center text-muted-foreground text-sm py-10">
      <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-50" />
      <p>{text}</p>
      {sub && <p className="text-xs mt-1">{sub}</p>}
    </div>
  );
}

function formatDate(d: string | Date) {
  return new Date(d).toLocaleDateString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
