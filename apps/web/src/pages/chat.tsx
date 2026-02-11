import { useParams, useNavigate } from "react-router-dom";
import { ConversationDetails, ConversationList } from "../components";
import { honoClient } from "../../lib/api";
import { Button } from "@repo/ui/components";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { useConversations } from "../hooks/use-conversations";

export default function ChatPage() {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const { createNewConversation } = useConversations();

  return (
    <div className="flex h-screen w-full">
      <ConversationList activeConversationId={conversationId || null} />

      {conversationId ? (
        <ConversationDetails conversationId={conversationId} />
      ) : (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden justify-center items-center">
          <Button onClick={createNewConversation} className="w-64">
            <PlusIcon className="w-4 h-4 mr-2" />
            Start a new conversation
          </Button>
        </div>
      )}
    </div>
  );
}
