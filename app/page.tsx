import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

const WEEKS = [
  { number: "01", title: "Sécurité intérieure" },
  { number: "02", title: "Corps et régulation" },
  { number: "03", title: "Relations et attachement" },
  { number: "04", title: "Mental, croyances et lucidité" },
  { number: "05", title: "Carrière, mission et place" },
  { number: "06", title: "Émotions et libération" },
  { number: "07", title: "Santé, énergie et vitalité" },
  { number: "08", title: "Renaissance identitaire" },
];

const RADAR_PHASES = ["Survie", "Adaptation", "Alignement", "Expansion"];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-8">
        <span className="font-display text-xl italic tracking-wide text-white/90">
          Renaissance
        </span>
        <Link
          href="/login"
          className="text-sm text-white/60 transition-colors hover:text-white"
        >
          Se connecter
        </Link>
      </header>

      {/* Hero */}
      <section className="mx-auto flex w-full max-w-3xl flex-col items-center px-6 pb-24 pt-16 text-center sm:pt-24">
        <p className="text-xs uppercase tracking-[0.3em] text-violet-300/80">
          Un accompagnement transformationnel · 8 semaines
        </p>
        <h1 className="mt-6 font-display text-5xl font-medium text-white sm:text-6xl">
          Renaissance
        </h1>
        <p className="mt-6 font-display text-xl italic text-white/80 sm:text-2xl">
          Plus qu&apos;un accompagnement : une rencontre avec vous-même.
        </p>
        <p className="mt-6 max-w-xl text-balance text-base leading-relaxed text-white/60">
          Tu as bâti, prouvé, tenu. Et pourtant, une fatigue de fond persiste, comme un
          signal que tu n&apos;écoutes plus. Renaissance est un espace pour ralentir, te
          réaligner et retrouver, en toi, une sécurité que rien ne pourra plus ébranler.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link href="/register" className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}>
            Commencer le parcours
          </Link>
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto")}
          >
            J&apos;ai déjà un compte
          </Link>
        </div>
      </section>

      {/* Pour qui */}
      <section className="mx-auto w-full max-w-3xl px-6 py-16 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-rose-300/80">Pour qui</p>
        <h2 className="mt-4 font-display text-3xl text-white sm:text-4xl">
          Pour les entrepreneurs qui n&apos;ont plus rien à prouver
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-white/60">
          Tu diriges, tu portes, tu avances — souvent pour les autres avant toi-même. Mais
          sous la réussite visible, l&apos;anxiété, l&apos;hypervigilance ou
          l&apos;épuisement se sont installés. Renaissance ne te demande pas d&apos;en
          faire plus. Seulement de revenir, doucement, à toi.
        </p>
      </section>

      {/* Le parcours */}
      <section className="mx-auto w-full max-w-3xl px-6 py-16">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gold-300/80">Le parcours</p>
          <h2 className="mt-4 font-display text-3xl text-white sm:text-4xl">
            8 semaines, 8 rencontres avec toi-même
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {WEEKS.map((week) => (
            <GlassCard key={week.number} className="flex items-center gap-4 px-5 py-4">
              <span className="font-display text-2xl text-violet-300/70">{week.number}</span>
              <span className="text-sm text-white/80">{week.title}</span>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Radar Renaissance */}
      <section className="mx-auto w-full max-w-3xl px-6 py-16 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-violet-300/80">
          Ton évolution, visible
        </p>
        <h2 className="mt-4 font-display text-3xl text-white sm:text-4xl">
          Le Radar Renaissance™
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-white/60">
          Avant de commencer, à mi-parcours et à la fin, tu fais le point sur 8 dimensions
          clés de ta sécurité intérieure. Semaine après semaine, tu vois ton chemin se
          dessiner.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {RADAR_PHASES.map((phase, i) => (
            <div key={phase} className="flex items-center gap-3">
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/70">
                {phase}
              </span>
              {i < RADAR_PHASES.length - 1 && (
                <span className="text-violet-300/50">→</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto w-full max-w-2xl px-6 py-24 text-center">
        <p className="font-display text-2xl italic text-white/85 sm:text-3xl">
          Ici, tu n&apos;as rien à prouver.
          <br />
          Seulement à te rencontrer.
        </p>
        <div className="mt-10">
          <Link href="/register" className={buttonVariants({ size: "lg" })}>
            Entrer dans mon espace
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto w-full max-w-5xl px-6 py-10 text-center text-xs text-white/30">
        <p>Renaissance — Plus qu&apos;un accompagnement : une rencontre avec vous-même.</p>
      </footer>
    </div>
  );
}
