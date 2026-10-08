import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Wind } from "lucide-react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { GroundingPlayer, type GroundingStep } from "@/components/features/revenir/GroundingPlayer";

const ORDER = ["grounding_54321", "grounding_body", "grounding_orientation"];

type PracticeRow = { key: string; title: string; description: string | null; config: unknown };

function getSteps(config: unknown): GroundingStep[] {
  const raw = (config as { steps?: GroundingStep[] } | null)?.steps;
  return Array.isArray(raw) ? raw.filter((s) => s && typeof s.prompt === "string") : [];
}

export default async function RevenirAMoiPage({
  searchParams,
}: {
  searchParams: Promise<{ p?: string }>;
}) {
  const { p } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const db = supabase as unknown as SupabaseClient;
  const { data } = await db
    .from("practices")
    .select("key, title, description, config")
    .eq("category", "besoin")
    .eq("is_active", true);

  const practices = ((data ?? []) as PracticeRow[]).sort(
    (a, b) => ORDER.indexOf(a.key) - ORDER.indexOf(b.key)
  );

  if (p) {
    const chosen = practices.find((x) => x.key === p);
    const steps = chosen ? getSteps(chosen.config) : [];
    if (chosen && steps.length > 0) {
      return (
        <GroundingPlayer
          practiceKey={chosen.key}
          title={chosen.title}
          description={chosen.description ?? ""}
          steps={steps}
        />
      );
    }
  }

  return (
    <div className="mx-auto max-w-2xl pb-8">
      <header className="pt-1">
        <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or-clair/70">Quand tu en as besoin</p>
        <h1 className="mt-3 font-rr-display text-4xl leading-tight text-rr-ivoire">Revenir à moi</h1>
        <p className="mt-3 text-sm leading-relaxed text-rr-gris-clair">
          Quelques minutes pour retrouver ton souffle et ton corps. Choisis ce qui te parle maintenant.
        </p>
      </header>

      <div className="mt-8 flex flex-col gap-3">
        {practices.map((x) => (
          <Link key={x.key} href={`/revenir-a-moi?p=${x.key}`} className="block">
            <GlassCard className="flex items-center justify-between gap-4 p-5 transition-colors hover:border-rr-or/30">
              <div>
                <p className="font-rr-serif text-lg italic text-rr-ivoire">{x.title}</p>
                {x.description && <p className="mt-1.5 text-sm text-rr-gris-clair">{x.description}</p>}
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-rr-or" strokeWidth={1.75} />
            </GlassCard>
          </Link>
        ))}

        <Link href="/pratique/soir" className="block">
          <GlassCard className="flex items-center justify-between gap-4 p-5 transition-colors hover:border-rr-or/30">
            <div className="flex items-center gap-3">
              <Wind className="h-4 w-4 text-rr-or" strokeWidth={1.75} />
              <p className="font-rr-serif text-lg italic text-rr-ivoire">Respirer lentement</p>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-rr-or" strokeWidth={1.75} />
          </GlassCard>
        </Link>
      </div>

      <p className="mt-10 text-xs leading-relaxed text-rr-gris">
        Ces outils sont des repères de bien-être, pas des soins. Si tu es en danger ou en grande détresse,
        appelle le 15, ou le 3114 (prévention du suicide, France, 24 h/24).
      </p>
    </div>
  );
}
