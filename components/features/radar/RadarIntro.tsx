"use client";

import { useState } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { RadarHistoryList } from "@/components/features/radar/RadarHistoryList";
import { cn } from "@/lib/utils";
import type { RadarBilan } from "@/lib/types/database.types";

type Tab = "nouveau" | "historique";

const TABS: { id: Tab; label: string }[] = [
  { id: "nouveau", label: "Nouveau bilan" },
  { id: "historique", label: "Mes bilans" },
];

const REPERES = [
  { valeur: "60", libelle: "questions" },
  { valeur: "3", libelle: "cercles" },
  { valeur: "12", libelle: "piliers" },
];

export function RadarIntro({ bilans }: { bilans: RadarBilan[] }) {
  const [tab, setTab] = useState<Tab>("nouveau");

  return (
    <div className="mx-auto max-w-2xl pb-8">
      <header className="pt-1">
        <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or">Le Programme Re-Naissance™</p>
        <h1 className="mt-3 font-rr-display text-4xl leading-tight text-rr-ivoire">Renaissance Radar™</h1>
        <p className="mt-2 font-rr-serif text-lg italic text-rr-or-clair">Cartographie de ton état intérieur</p>

        <p className="mt-6 font-rr-serif text-base italic leading-relaxed text-rr-creme">
          Le Renaissance Radar™ n&apos;est pas un test de personnalité. C&apos;est un miroir. Il t&apos;aide à
          observer ton niveau actuel de survie, d&apos;adaptation, d&apos;alignement et d&apos;expansion.
        </p>
      </header>

      <div
        role="tablist"
        aria-label="Radar"
        className="mt-8 grid grid-cols-2 gap-1 rounded-full border border-rr-or/15 bg-white/[0.03] p-1"
      >
        {TABS.map(({ id, label }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(id)}
              className={cn(
                "h-11 rounded-full text-xs uppercase tracking-[0.2em] transition-all duration-300",
                active
                  ? "bg-rr-or/[0.16] text-rr-or-clair shadow-[inset_0_0_0_1px_rgba(201,169,110,0.3)]"
                  : "text-rr-gris hover:text-rr-gris-clair"
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {tab === "nouveau" ? (
          <GlassCard className="p-6 text-center">
            <div className="grid grid-cols-3 gap-2" aria-label="60 questions, 3 cercles, 12 piliers">
              {REPERES.map((repere) => (
                <div key={repere.libelle}>
                  <p className="font-rr-display text-3xl text-rr-or">{repere.valeur}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-rr-gris">{repere.libelle}</p>
                </div>
              ))}
            </div>

            <p className="mt-7 font-rr-serif text-base italic leading-relaxed text-rr-creme">
              Une question à la fois. Réponds en conscience, sans te juger : il n&apos;y a pas de bonne réponse,
              seulement la tienne, à cet instant.
            </p>

            <Link
              href="/radar/session"
              className="mt-7 flex h-12 items-center justify-center rounded-full bg-rr-or text-xs uppercase tracking-[0.25em] text-rr-noir transition-all duration-300 hover:bg-rr-or-clair"
            >
              Commencer mon bilan
            </Link>
          </GlassCard>
        ) : (
          <RadarHistoryList bilans={bilans} />
        )}
      </div>
    </div>
  );
}
