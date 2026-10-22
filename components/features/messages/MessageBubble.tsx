import { cn } from "@/lib/utils";
import type { Message } from "@/lib/types/database.types";

function timeOf(iso: string): string {
  return new Date(iso).toLocaleTimeString("fr-FR", {
    timeZone: "Europe/Paris",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MessageBubble({ message, isOwn }: { message: Message; isOwn: boolean }) {
  return (
    <div className={cn("flex flex-col pb-1.5", isOwn ? "items-end" : "items-start")}>
      <div
        className={cn(
          "max-w-[82%] whitespace-pre-wrap break-words rounded-[22px] px-[17px] py-[13px] text-[14.5px] leading-[1.45]",
          isOwn
            ? "rounded-br-md bg-rr-or text-rr-noir"
            : "rounded-bl-md border border-white/[0.08] bg-white/[0.07] text-rr-creme"
        )}
      >
        {message.content}
      </div>
      <span className="mx-1.5 mt-1 text-[10.5px] text-rr-gris">{timeOf(message.created_at)}</span>
    </div>
  );
}
