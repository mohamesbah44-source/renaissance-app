import { createClient } from "@/lib/supabase/server";
import { getProfile, getPractitioner } from "@/lib/supabase/queries";
import { MessageThread } from "@/components/features/messages/MessageThread";
import { MessageComposer } from "@/components/features/messages/MessageComposer";
import { MarkMessagesRead } from "@/components/features/messages/MarkMessagesRead";

export default async function MessagesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const practitioner = await getPractitioner(supabase);

  if (!practitioner) {
    return (
      <div className="mx-auto max-w-2xl pb-8">
        <header className="pt-1">
          <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or">Messages</p>
          <h1 className="mt-3 font-rr-display text-4xl leading-tight text-rr-ivoire">Ton espace d&apos;échange</h1>
        </header>

        <p className="mt-10 px-4 text-center font-rr-serif text-lg italic leading-relaxed text-rr-gris-clair">
          La messagerie sera bientôt disponible.
        </p>
      </div>
    );
  }

  const profile = await getProfile(supabase, user.id);

  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .or(
      `and(sender_id.eq.${user.id},recipient_id.eq.${practitioner.id}),and(sender_id.eq.${practitioner.id},recipient_id.eq.${user.id})`
    )
    .order("created_at", { ascending: true });

  return (
    <div className="mx-auto flex max-w-2xl flex-col pb-4">
      <MarkMessagesRead userId={user.id} fromUserId={practitioner.id} />

      <header className="pt-1">
        <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or">Messages</p>
        <h1 className="mt-3 font-rr-display text-4xl leading-tight text-rr-ivoire">
          {practitioner.first_name ? `Échange avec ${practitioner.first_name}` : "Ton espace d'échange"}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-rr-gris-clair">
          {profile?.first_name
            ? `${profile.first_name}, un mot, une question, un doute : ce fil est là pour toi.`
            : "Un mot, une question, un doute : ce fil est là pour toi."}
        </p>
      </header>

      <div className="mt-8">
        <MessageThread messages={messages ?? []} currentUserId={user.id} />
      </div>

      <div className="sticky bottom-24 z-10 mt-6 rounded-[28px] bg-rr-noir/90 backdrop-blur-xl">
        <MessageComposer recipientId={practitioner.id} />
      </div>
    </div>
  );
}
