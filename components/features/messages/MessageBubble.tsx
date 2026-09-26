import { cn, formatDateTime } from "@/lib/utils";
import type { Message } from "@/lib/types/database.types";

export function MessageBubble({ message, isOwn }: { message: Message; isOwn: boolean }) {
  return (
    <div className={cn("flex flex-col", isOwn ? "items-end" : "items-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-3xl px-4 py-3 text-sm leading-relaxed",
          isOwn
            ? "rounded-br-md bg-gradient-to-br from-gold-500/30 to-gold-400/20 text-white"
            : "rounded-bl-md border border-white/10 bg-white/[0.04] text-white/80"
        )}
      >
        {message.content}
      </div>
      <span className="mt-1 px-1 text-[11px] text-white/30">{formatDateTime(message.created_at)}</span>
    </div>
  );
}
