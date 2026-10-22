import { MessageBubble } from "@/components/features/messages/MessageBubble";
import type { Message } from "@/lib/types/database.types";

const TZ = "Europe/Paris";

function dayKey(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", { timeZone: TZ });
}

function dayLabel(iso: string): string {
  const key = dayKey(iso);
  const now = new Date();
  const today = now.toLocaleDateString("en-CA", { timeZone: TZ });
  const yesterday = new Date(now.getTime() - 24 * 3600 * 1000).toLocaleDateString("en-CA", { timeZone: TZ });
  if (key === today) return "Aujourd'hui";
  if (key === yesterday) return "Hier";
  return new Date(iso).toLocaleDateString("fr-FR", { timeZone: TZ, day: "numeric", month: "long" });
}

export function MessageThread({ messages, currentUserId }: { messages: Message[]; currentUserId: string }) {
  if (messages.length === 0) {
    return (
      <p className="px-4 py-12 text-center font-rr-serif text-lg italic leading-relaxed text-rr-gris-clair">
        Aucun message pour le moment.
        <br />
        Écris le premier, quand tu en ressens le besoin.
      </p>
    );
  }

  let lastDay = "";

  return (
    <div className="flex flex-col gap-1.5">
      {messages.map((message) => {
        const key = dayKey(message.created_at);
        const showDay = key !== lastDay;
        lastDay = key;
        return (
          <div key={message.id} className="flex flex-col gap-1.5">
            {showDay && (
              <p className="my-3 text-center text-[11px] uppercase tracking-[0.2em] text-rr-gris">
                {dayLabel(message.created_at)}
              </p>
            )}
            <MessageBubble message={message} isOwn={message.sender_id === currentUserId} />
          </div>
        );
      })}
    </div>
  );
}
