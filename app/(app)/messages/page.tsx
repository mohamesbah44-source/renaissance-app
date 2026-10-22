import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getPractitioner } from "@/lib/supabase/queries";
import { MessageThread } from "@/components/features/messages/MessageThread";
import { MessageComposer } from "@/components/features/messages/MessageComposer";
import { MarkMessagesRead } from "@/components/features/messages/MarkMessagesRead";

function BackLink() {
  return (
    <Link
      href="/aujourdhui"
      aria-label="Retour"
      className="-ml-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-rr-gris-clair transition-colors hover:text-rr-ivoire"
    >
      <ChevronLeft className="h-5 w-5" strokeWidth={1.6} />
    </Link>
  );
}

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
      <div className="rr-enter mx-auto max-w-2xl pb-8">
        <BackLink />
        <header className="mt-3">
          <p className="text-[10px] uppercase tracking-[0.3em] text-rr-or">Messages</p>
          <h1 className="mt-4 font-rr-display text-rr-ivoire">Ton espace d&apos;échange.</h1>
        </header>

        <p className="mt-14 px-4 text-center font-rr-serif text-lg italic leading-relaxed text-rr-gris-clair">
          La messagerie sera bientôt disponible.
        </p>
      </div>
    );
  }

  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .or(
      `and(sender_id.eq.${user.id},recipient_id.eq.${practitioner.id}),and(sender_id.eq.${practitioner.id},recipient_id.eq.${user.id})`
    )
    .order("created_at", { ascending: true });

  const name = practitioner.first_name ?? "ton praticien";

  return (
    <div className="mx-auto flex max-w-2xl flex-col pb-4">
      <MarkMessagesRead userId={user.id} fromUserId={practitioner.id} />

      <header className="flex items-center gap-3">
        <BackLink />
        <span
          aria-hidden
          className="-ml-2 h-[38px] w-[38px] shrink-0 rounded-full"
          style={{
            background: "radial-gradient(circle at 35% 30%, #ddd6fe 0%, #7c3aed 55%, #2e1065 100%)",
            boxShadow: "0 0 18px rgba(139,92,246,0.5)",
          }}
        />
        <div className="min-w-0">
          <h1 className="font-rr-serif text-[22px] leading-none text-rr-ivoire">{name}</h1>
          <p className="mt-1.5 text-[11.5px] text-rr-gris-clair">Ton praticien · répond sous 24 h</p>
        </div>
      </header>

      <div className="mt-8">
        <MessageThread messages={messages ?? []} currentUserId={user.id} />
      </div>

      <div className="sticky bottom-24 z-10 mt-6 rounded-[32px] bg-rr-noir/85 p-1 backdrop-blur-xl">
        <MessageComposer recipientId={practitioner.id} recipientName={name} />
      </div>
    </div>
  );
}
