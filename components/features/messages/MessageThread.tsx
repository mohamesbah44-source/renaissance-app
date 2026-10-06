import { MessageBubble } from "@/components/features/messages/MessageBubble";
import type { Message } from "@/lib/types/database.types";

export function MessageThread({ messages, currentUserId }: { messages: Message[]; currentUserId: string }) {
  if (messages.length === 0) {
    return (
      <p className="px-4 py-8 text-center font-rr-serif text-lg italic leading-relaxed text-rr-gris-clair">
        Aucun message pour le moment.
        <br />
        Écris le premier, quand tu en ressens le besoin.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} isOwn={message.sender_id === currentUserId} />
      ))}
    </div>
  );
}
