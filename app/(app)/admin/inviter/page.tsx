import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { InviteMemberForm } from "@/components/features/admin/InviteMemberForm";
import { todayISODate } from "@/lib/habits/streak";

export default async function InviterPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (me?.role !== "admin") redirect("/aujourdhui");

  return (
    <div className="mx-auto max-w-2xl pb-8">
      <Link href="/admin/clients" className="text-xs text-rr-gris transition-colors hover:text-rr-gris-clair">
        ← Retour aux participant·e·s
      </Link>
      <header className="mt-3">
        <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or-clair/70">Nouveau membre</p>
        <h1 className="mt-3 font-rr-display text-4xl leading-tight text-rr-ivoire">Inviter un membre</h1>
        <p className="mt-3 text-sm leading-relaxed text-rr-gris-clair">
          Le compte est créé, et tu reçois un lien personnel à lui envoyer. Il choisit son mot de passe et entre dans le
          programme.
        </p>
      </header>
      <div className="mt-8">
        <InviteMemberForm defaultDate={todayISODate()} />
      </div>
    </div>
  );
}
