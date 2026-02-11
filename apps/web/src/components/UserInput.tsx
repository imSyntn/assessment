import { Button, Textarea } from "@repo/ui/components";
import { Send } from "lucide-react";

export const UserInput = ({
  input,
  setInput,
  isLoading,
  handleSubmit,
}: {
  input: string;
  setInput: (input: string) => void;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
}) => {
  return (
    <div className="border-t p-4">
      <form onSubmit={handleSubmit} className="flex gap-2 items-end">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          rows={1}
          className="min-h-[60px] resize-none"
          placeholder="Type your message..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) handleSubmit(e);
          }}
        />
        <Button
          type="submit"
          disabled={!input.trim() || isLoading}
          size="icon"
          className="h-[60px] w-[60px]"
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
};
