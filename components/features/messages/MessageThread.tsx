import { GlassCard } from "@/components/ui/GlassCard";
import { MessageBubble } from "@/components/features/messages/MessageBubble";
import type { Message } from "@/lib/types/database.types";

export function MessageThread({ messages, currentUserId }: { messages: Message[]; currentUserId: string }) {
  if (messages.length === 0) {
    return (
      <GlassCard className="p-6">
        <p className="text-sm text-white/60">
          Aucun message pour le moment. Écris le premier, quand tu en ressens le besoin.
        </p>
      </GlassCard>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} isOwn={message.sender_id === currentUserId} />
      ))}
    </div>
  );
}
