import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { GroundingPlayer, type GroundingStep } from "@/components/features/revenir/GroundingPlayer";

const ORDER = ["grounding_54321", "grounding_body", "grounding_orientation"];

const BESOINS = [
  { label: "Je suis submergé·e", href: "/sos" },
  { label: "J'ai besoin de me calmer", href: "/respiration" },
  { label: "Je n'arrive pas à dormir", href: "/pratique/sommeil" },
  { label: "Écrire à mon praticien", href: "/messages" },
];

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
    <div className="rr-enter mx-auto max-w-2xl pb-8">
      <Link
        href="/aujourdhui"
        aria-label="Retour"
        className="-ml-3 flex h-11 w-11 items-center justify-center rounded-full text-rr-gris-clair transition-colors hover:text-rr-ivoire"
      >
        <ChevronLeft className="h-5 w-5" strokeWidth={1.6} />
      </Link>

      <header className="mt-3">
        <p className="text-[10px] uppercase tracking-[0.3em] text-rr-or">Quand tu en as besoin</p>
        <h1 className="mt-4 font-rr-display text-rr-ivoire">Revenir à moi.</h1>
        <p className="mt-4 text-sm leading-relaxed text-rr-gris-clair">
          Choisis ce qui est là maintenant. Une seule chose suffit.
        </p>
      </header>

      <div className="mt-10 flex flex-col gap-3.5">
        {BESOINS.map((b) => (
          <Link
            key={b.href}
            href={b.href}
            className="flex h-[84px] items-center justify-between rounded-3xl border border-white/[0.09] bg-white/[0.04] px-[22px] transition-colors duration-300 hover:border-rr-or/30"
          >
            <span className="font-rr-serif text-[23px] italic text-rr-ivoire">{b.label}</span>
            <ChevronRight className="h-[18px] w-[18px] shrink-0 text-rr-or" strokeWidth={1.6} />
          </Link>
        ))}
      </div>

      {practices.length > 0 && (
        <section className="mt-12">
          <p className="text-[11px] uppercase tracking-[0.28em] text-rr-gris-clair">Revenir au corps</p>
          <div className="mt-2">
            {practices.map((x) => (
              <Link
                key={x.key}
                href={`/revenir-a-moi?p=${x.key}`}
                className="flex items-center justify-between gap-4 border-b border-white/[0.08] py-4 last:border-b-0"
              >
                <div className="min-w-0">
                  <p className="font-rr-serif text-xl italic text-rr-ivoire">{x.title}</p>
                  {x.description && <p className="mt-1 text-xs text-rr-gris-clair">{x.description}</p>}
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-rr-or" strokeWidth={1.6} />
              </Link>
            ))}
          </div>
        </section>
      )}

      <p className="mt-10 text-center text-[11.5px] leading-relaxed text-rr-gris">
        Cette application accompagne ton bien-être. Elle ne remplace pas un avis médical. Si tu es en danger ou en
        grande détresse, appelle le 15, ou le 3114 (prévention du suicide, France, 24 h/24).
      </p>
    </div>
  );
}
