import { createClient } from "@/lib/supabase/server";
import { getProfile, getPractitioner } from "@/lib/supabase/queries";
import { GlassCard } from "@/components/ui/GlassCard";
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
        <header className="pt-2">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Messages</p>
          <h1 className="mt-2 font-display text-3xl text-white">Ton espace d&apos;échange</h1>
        </header>

        <GlassCard className="mt-8 p-6">
          <p className="text-sm text-white/60">La messagerie sera bientôt disponible.</p>
        </GlassCard>
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
    <div className="mx-auto flex max-w-2xl flex-col pb-8">
      <MarkMessagesRead userId={user.id} fromUserId={practitioner.id} />

      <header className="pt-2">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">Messages</p>
        <h1 className="mt-2 font-display text-3xl text-white">
          {practitioner.first_name ? `Échange avec ${practitioner.first_name}` : "Ton espace d'échange"}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-white/60">
          {profile?.first_name
            ? `${profile.first_name}, un mot, une question, un doute : ce fil est là pour toi.`
            : "Un mot, une question, un doute : ce fil est là pour toi."}
        </p>
      </header>

      <div className="mt-8">
        <MessageThread messages={messages ?? []} currentUserId={user.id} />
      </div>

      <div className="mt-6">
        <MessageComposer recipientId={practitioner.id} />
      </div>
    </div>
  );
}
