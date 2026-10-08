import Link from "next/link";
import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";

const CERCLES = [
  { id: "moi", nom: "Moi", description: "Ton monde intérieur : corps, émotions, mental, identité, histoire." },
  { id: "nous", nom: "Nous", description: "Tes liens : attachement, relations, intimité, appartenance." },
  { id: "monde", nom: "Monde", description: "Ta place : matière, œuvre, sens." },
] as const;

function motPour(ratio: number | undefined): string {
  if (typeof ratio !== "number") return "à découvrir";
  if (ratio < 0.42) return "plutôt apaisé";
  if (ratio < 0.62) return "nuancé";
  return "plus chargé";
}

export default async function BienvenueRadarResultatPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  if (!id) redirect("/bienvenue?step=2");

  const db = supabase as unknown as SupabaseClient;
  const { data: bilan } = await db
    .from("radar_bilans")
    .select("cercle_scores")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!bilan) redirect("/bienvenue?step=1");

  const scores = (bilan.cercle_scores ?? {}) as Partial<Record<(typeof CERCLES)[number]["id"], number>>;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col px-6 pb-10 pt-12">
      <p className="text-center text-[11px] uppercase tracking-[0.35em] text-rr-or">Ton point de départ</p>

      <div className="flex flex-1 flex-col justify-center py-8">
        <h1 className="text-center font-rr-display text-3xl leading-tight text-rr-ivoire">C&apos;est posé.</h1>
        <p className="mt-5 text-center font-rr-serif text-lg italic leading-relaxed text-rr-gris-clair">
          Ce n&apos;est pas une note. C&apos;est une photographie de cette période. Dans quelques semaines, tu
          pourras la comparer.
        </p>

        <div className="mt-9 flex flex-col gap-3">
          {CERCLES.map((cercle) => (
            <GlassCard key={cercle.id} variant="quiet" className="flex items-center justify-between gap-4 p-5">
              <div className="min-w-0">
                <p className="font-rr-display text-lg text-rr-ivoire">{cercle.nom}</p>
                <p className="mt-1 text-xs leading-relaxed text-rr-gris">{cercle.description}</p>
              </div>
              <p className="shrink-0 font-rr-serif text-base italic text-rr-or">{motPour(scores[cercle.id])}</p>
            </GlassCard>
          ))}
        </div>

        <p className="mt-7 text-center text-xs leading-relaxed text-rr-gris">
          Tu retrouveras tous les détails de ton Radar dans l&apos;application.
        </p>
      </div>

      <Link
        href="/bienvenue?step=2"
        className="flex h-14 w-full items-center justify-center rounded-full bg-rr-or text-[15px] font-medium text-rr-noir transition-opacity hover:opacity-90"
      >
        Découvrir l&apos;application
      </Link>
    </main>
  );
}
