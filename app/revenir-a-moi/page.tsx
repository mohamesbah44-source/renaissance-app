import Link from "next/link";
import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

const ORDER = ["grounding_54321", "grounding_body", "grounding_orientation"];

export default async function RevenirAMoiPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const db = supabase as unknown as SupabaseClient;
  const { data } = await db
    .from("practices")
    .select("key, title, description")
    .eq("category", "besoin")
    .eq("is_active", true);

  const practices = ((data ?? []) as { key: string; title: string; description: string | null }[]).sort(
    (a, b) => {
      const ia = ORDER.indexOf(a.key);
      const ib = ORDER.indexOf(b.key);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    }
  );

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <p className="text-xs uppercase tracking-[0.25em] text-rr-or">Un instant pour toi</p>
      <h1 className="mt-2 font-rr-display text-3xl text-rr-ivoire">J&apos;ai besoin de revenir à moi</h1>
      <p className="mt-3 font-rr-serif text-lg leading-relaxed text-rr-gris-clair">
        Choisis ce qui te convient maintenant. Il n&apos;y a rien à réussir : tu avances à ton rythme, et tu peux
        t&apos;arrêter à tout moment.
      </p>

      <div className="mt-8 space-y-3">
        {practices.map((p) => (
          <Link
            key={p.key}
            href={`/revenir-a-moi/${p.key}`}
            className="group flex items-center justify-between gap-4 rounded-2xl border border-rr-or/20 bg-white/5 px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-rr-or/50"
          >
            <div>
              <p className="font-rr-display text-lg text-rr-ivoire">{p.title}</p>
              {p.description && <p className="mt-1 text-sm text-rr-gris-clair">{p.description}</p>}
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-rr-or transition-transform group-hover:translate-x-1" />
          </Link>
        ))}

        <Link
          href="/pratique/soir"
          className="group flex items-center justify-between gap-4 rounded-2xl border border-rr-or/20 bg-white/5 px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-rr-or/50"
        >
          <div>
            <p className="font-rr-display text-lg text-rr-ivoire">Respirer lentement</p>
            <p className="mt-1 text-sm text-rr-gris-clair">Une respiration douce et guidée, sans rien d&apos;autre à faire.</p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-rr-or transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <p className="mt-10 text-xs leading-relaxed text-rr-gris">
        Ces pratiques sont des outils de bien-être, elles ne remplacent pas un accompagnement médical ou
        psychologique. Si tu te sens en danger ou en détresse importante, appelle le 15, ou le 3114 (prévention du
        suicide, France, 24 h/24).
      </p>
    </div>
  );
}
