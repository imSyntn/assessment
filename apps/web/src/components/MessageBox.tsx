import { cn } from "@repo/ui/lib/utils";
import { BotIcon } from "lucide-react";

function renderMessageText(message: any) {
  if (message.parts) {
    return message.parts.map((part: any, i: number) =>
      part.type === "text" ? <span key={i}>{part.text}</span> : null,
    );
  }

  if (typeof message.content === "string") {
    return message.content;
  }

  return null;
}

export const MessageBox = ({ m }: { m: any }) => {
  return (
    <div
      key={m.id}
      className={cn(
        "flex",
        m.role === "user" ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "max-w-[70%] rounded-2xl px-4 py-3 shadow-sm",
          m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
        )}
      >
        {m.role === "assistant" && (
          <div className="mb-2">
            <BotIcon />
          </div>
        )}

        <p className="text-sm whitespace-pre-wrap">{renderMessageText(m)}</p>
      </div>
    </div>
  );
};
