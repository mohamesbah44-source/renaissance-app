import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

const WEEKS = [
  { number: "01", title: "Sécurité intérieure" },
  { number: "02", title: "Corps et régulation" },
  { number: "03", title: "Relations, attachement & intimité" },
  { number: "04", title: "Mental, croyances et lucidité" },
  { number: "05", title: "Carrière, place & appartenance" },
  { number: "06", title: "Émotions et libération" },
  { number: "07", title: "Santé, vitalité & sens" },
  { number: "08", title: "Renaissance identitaire" },
];

const RADAR_PHASES = ["Survie", "Adaptation", "Alignement", "Expansion"];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-rr-noir/70 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-4 sm:px-6 sm:py-6">
          <span className="flex items-center gap-2.5 font-rr-display text-sm uppercase tracking-[0.14em] text-rr-ivoire/90">
            <Image src="/logo-icon.png" alt="" width={26} height={26} className="rounded-full ring-1 ring-rr-or/25" priority />
            <span>
              <span className="hidden sm:inline">Le Programme </span>
              <span className="text-rr-or">Re-Naissance</span>
              <sup className="text-[8px]">™</sup>
            </span>
          </span>
          <Link
            href="/login"
            className="rounded-full px-4 py-2 text-sm text-rr-gris-clair transition-all duration-300 hover:bg-white/[0.05] hover:text-rr-ivoire"
          >
            Se connecter
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative mx-auto flex w-full max-w-3xl flex-col items-center overflow-hidden px-6 pb-24 pt-12 text-center sm:pb-32 sm:pt-32">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-12 h-72 w-72 -translate-x-1/2 rounded-full bg-rr-or/10 blur-[90px]"
        />

        <p
          className="animate-fade-up text-[11px] uppercase tracking-[0.3em] text-rr-or/80 sm:text-xs sm:tracking-[0.35em]"
          style={{ animationDelay: "0ms" }}
        >
          Un accompagnement transformationnel · 8 semaines
        </p>

        <div className="relative mt-8 flex flex-col items-center sm:mt-10">
          <div
            aria-hidden
            className="animate-breathe absolute inset-0 -z-10 rounded-full bg-rr-or/15 blur-2xl"
          />
          <Image
            src="/logo-icon.png"
            alt="Le Programme Re-Naissance™"
            width={132}
            height={132}
            className="animate-fade-up h-28 w-28 rounded-full ring-1 ring-rr-or/30 sm:h-[132px] sm:w-[132px]"
            style={{ animationDelay: "80ms" }}
            priority
          />
          <p
            className="animate-fade-up mt-6 font-rr-display text-sm uppercase tracking-[0.4em] text-rr-or-clair sm:mt-7"
            style={{ animationDelay: "160ms" }}
          >
            Le Programme
          </p>
          <h1
            className="animate-fade-up mt-3 font-rr-display text-5xl font-medium text-rr-ivoire sm:text-6xl"
            style={{ animationDelay: "220ms" }}
          >
            Re-Naissance<sup className="ml-1 text-lg align-super">™</sup>
          </h1>
        </div>

        <p
          className="animate-fade-up mt-7 font-rr-serif text-xl italic text-rr-creme sm:mt-8 sm:text-2xl"
          style={{ animationDelay: "300ms" }}
        >
          Plus qu&apos;un accompagnement : une rencontre avec toi-même.
        </p>
        <p
          className="animate-fade-up mt-6 max-w-xl text-balance text-base leading-relaxed text-rr-gris-clair sm:mt-7"
          style={{ animationDelay: "360ms" }}
        >
          Tu as bâti, prouvé, tenu. Et pourtant, une fatigue de fond persiste, comme un
          signal que tu n&apos;écoutes plus. Le Programme Re-Naissance™ est un espace pour ralentir, te
          réaligner et retrouver, en toi, une sécurité que rien ne pourra plus ébranler.
        </p>
        <div
          className="animate-fade-up mt-10 flex w-full flex-col gap-4 sm:mt-12 sm:w-auto sm:flex-row"
          style={{ animationDelay: "420ms" }}
        >
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
      <section className="mx-auto w-full max-w-3xl px-6 py-16 text-center sm:py-24">
        <p className="text-xs uppercase tracking-[0.3em] text-rr-or/80">Pour qui</p>
        <h2 className="mt-5 font-rr-display text-3xl text-rr-ivoire sm:text-4xl">
          Pour les entrepreneurs qui n&apos;ont plus rien à prouver
        </h2>
        <p className="mx-auto mt-7 max-w-2xl text-balance text-base leading-relaxed text-rr-gris-clair">
          Tu diriges, tu portes, tu avances — souvent pour les autres avant toi-même. Mais
          sous la réussite visible, l&apos;anxiété, l&apos;hypervigilance ou
          l&apos;épuisement se sont installés. Le Programme Re-Naissance™ ne te demande pas d&apos;en
          faire plus. Seulement de revenir, doucement, à toi.
        </p>
      </section>

      {/* Le parcours */}
      <section className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-24">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-rr-or/80">Le parcours</p>
          <h2 className="mt-5 font-rr-display text-3xl text-rr-ivoire sm:text-4xl">
            8 semaines, 8 rencontres avec toi-même
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-3 sm:mt-14 sm:grid-cols-2 sm:gap-4">
          {WEEKS.map((week) => (
            <GlassCard
              key={week.number}
              className="group flex items-center gap-4 px-6 py-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-rr-or/30"
            >
              <span className="font-rr-display text-2xl text-rr-or/70 transition-colors duration-300 group-hover:text-rr-or">
                {week.number}
              </span>
              <span className="text-sm leading-snug text-rr-ivoire/85">{week.title}</span>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Radar Re-Naissance */}
      <section className="mx-auto w-full max-w-3xl px-6 py-16 text-center sm:py-24">
        <p className="text-xs uppercase tracking-[0.3em] text-rr-or/80">
          Ton évolution, visible
        </p>
        <h2 className="mt-5 font-rr-display text-3xl text-rr-ivoire sm:text-4xl">
          Le Radar Re-Naissance™
        </h2>
        <p className="mx-auto mt-7 max-w-2xl text-balance text-base leading-relaxed text-rr-gris-clair">
          Avant de commencer, à mi-parcours et à la fin, tu fais le point sur 3 cercles — Moi,
          Nous, Monde — et 12 piliers clés de ta sécurité intérieure. Semaine après semaine, tu
          vois ton chemin se dessiner.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:mt-12">
          {RADAR_PHASES.map((phase, i) => (
            <div key={phase} className="flex items-center gap-3">
              <span className="rounded-full border border-rr-or/20 bg-white/[0.04] px-5 py-2.5 text-sm text-rr-gris-clair transition-all duration-300 hover:border-rr-or/40 hover:text-rr-ivoire">
                {phase}
              </span>
              {i < RADAR_PHASES.length - 1 && (
                <span className="text-rr-or/60">→</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative mx-auto w-full max-w-2xl overflow-hidden px-6 py-24 text-center sm:py-32">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rr-or/[0.08] blur-[100px]"
        />
        <p className="font-rr-serif text-2xl italic text-rr-creme sm:text-3xl">
          Ici, tu n&apos;as rien à prouver.
          <br />
          Seulement à te rencontrer.
        </p>
        <div className="mt-10 sm:mt-12">
          <Link href="/register" className={buttonVariants({ size: "lg" })}>
            Entrer dans mon espace
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto w-full max-w-5xl px-6 py-12 text-center text-xs text-rr-gris/60">
        <p>Le Programme Re-Naissance™ — Plus qu&apos;un accompagnement : une rencontre avec toi-même.</p>
      </footer>
    </div>
  );
}
