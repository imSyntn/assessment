import { MessageSquare } from "lucide-react";

export const EmptyState = () => {
  return (
    <div className="flex h-full items-center justify-center text-center text-muted-foreground">
      <div>
        <MessageSquare className="w-14 h-14 mx-auto mb-4 opacity-50" />
        <p>Start a conversation with the AI support agent.</p>
      </div>
    </div>
  );
};
