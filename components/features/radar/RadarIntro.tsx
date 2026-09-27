"use client";

import { useState } from "react";
import Link from "next/link";
import { RadarHistoryList } from "@/components/features/radar/RadarHistoryList";
import { cn } from "@/lib/utils";
import type { RadarBilan } from "@/lib/types/database.types";

type Tab = "nouveau" | "historique";

export function RadarIntro({ bilans }: { bilans: RadarBilan[] }) {
  const [tab, setTab] = useState<Tab>("nouveau");

  return (
    <div className="pb-8 pt-2">
      <p className="text-xs uppercase tracking-[0.35em] text-rr-or">Le Programme Re-Naissance™</p>
      <h1 className="mt-3 font-rr-display text-3xl uppercase tracking-[0.08em] text-rr-ivoire">
        Renaissance Radar™
      </h1>
      <p className="mt-2 font-rr-serif text-lg italic text-rr-or-clair">Cartographie de ton état intérieur</p>

      <p className="mt-6 font-rr-serif text-lg italic leading-relaxed text-rr-creme">
        Le Renaissance Radar™ n&apos;est pas un test de personnalité. C&apos;est un miroir. Il t&apos;aide à
        observer ton niveau actuel de survie, d&apos;adaptation, d&apos;alignement et d&apos;expansion.
      </p>

      <div className="mt-8 flex gap-2 border-b border-rr-or/15">
        <button
          type="button"
          onClick={() => setTab("nouveau")}
          className={cn(
            "px-4 pb-3 text-xs uppercase tracking-[0.25em] transition-all duration-300",
            tab === "nouveau"
              ? "border-b-2 border-rr-or text-rr-or-clair"
              : "text-rr-gris hover:text-rr-gris-clair"
          )}
        >
          Nouveau bilan
        </button>
        <button
          type="button"
          onClick={() => setTab("historique")}
          className={cn(
            "px-4 pb-3 text-xs uppercase tracking-[0.25em] transition-all duration-300",
            tab === "historique"
              ? "border-b-2 border-rr-or text-rr-or-clair"
              : "text-rr-gris hover:text-rr-gris-clair"
          )}
        >
          Mes bilans précédents
        </button>
      </div>

      <div className="mt-6">
        {tab === "nouveau" ? (
          <div className="rounded-2xl border border-rr-or/15 bg-rr-encre p-6 text-center">
            <p className="font-rr-serif text-lg italic text-rr-creme">
              Soixante questions, une question à la fois, à travers 3 cercles et 12 piliers.
              Réponds en conscience, sans te juger : il n&apos;y a pas de bonne réponse,
              seulement la tienne, à cet instant.
            </p>
            <Link
              href="/radar/session"
              className="mt-7 inline-flex items-center justify-center rounded-full bg-rr-or px-8 py-3 text-xs uppercase tracking-[0.25em] text-rr-noir transition-all duration-300 hover:-translate-y-0.5 hover:bg-rr-or-clair"
            >
              Commencer mon bilan
            </Link>
          </div>
        ) : (
          <RadarHistoryList bilans={bilans} />
        )}
      </div>
    </div>
  );
}
