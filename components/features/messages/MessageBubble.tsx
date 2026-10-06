import { cn, formatDateTime } from "@/lib/utils";
import type { Message } from "@/lib/types/database.types";

export function MessageBubble({ message, isOwn }: { message: Message; isOwn: boolean }) {
  return (
    <div className={cn("flex flex-col", isOwn ? "items-end" : "items-start")}>
      <div
        className={cn(
          "max-w-[85%] whitespace-pre-wrap break-words rounded-3xl px-4 py-3 leading-relaxed",
          isOwn
            ? "rounded-br-md border border-rr-or/30 bg-rr-or/[0.14] text-sm text-rr-ivoire"
            : "rounded-bl-md border border-white/10 bg-white/[0.04] font-rr-serif text-base text-rr-ivoire/90"
        )}
      >
        {message.content}
      </div>
      <span className="mt-1.5 px-1 text-[11px] text-rr-gris">{formatDateTime(message.created_at)}</span>
    </div>
  );
}
