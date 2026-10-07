"use client";

import { useState } from "react";
import { EVOLUTION_STATES, PILIERS, CERCLES, type CercleId } from "@/lib/radar/constants";
import { MICRO_PROTOCOLS } from "@/lib/radar/protocols";
import { ETAT_MESSAGES, PRIORITY_REASONS } from "@/lib/radar/messages";
import { fenetreInterpretation, type PillarScore, type TopPriority } from "@/lib/radar/scoring";
import { formatDate } from "@/lib/utils";
import type { RadarBilan } from "@/lib/types/database.types";

const NOIR: [number, number, number] = [12, 11, 10];
const IVOIRE: [number, number, number] = [245, 240, 232];
const OR: [number, number, number] = [201, 169, 110];
const GRIS: [number, number, number] = [138, 130, 120];
const CERCLE_RGB: Record<CercleId, [number, number, number]> = {
  moi: [201, 169, 110],
  nous: [90, 138, 110],
  monde: [155, 107, 58],
};

const MARGIN_X = 18;
const MARGIN_TOP = 20;
const MARGIN_BOTTOM = 22;

const FOOTER_TEXT =
  "Ce rapport est un support d'introspection. Il ne remplace pas un avis médical, psychologique ou thérapeutique.";

/** Les polices de base du PDF ne gèrent ni les emojis ni les espaces spéciaux : on les retire. */
function clean(text: string): string {
  return String(text ?? "")
    .replace(/[\u00A0\u202F\u2009\u2007]/g, " ")
    .replace(/[^\n\u0020-\u00FF\u2013\u2014\u2018\u2019\u201C\u201D\u2026\u2122\u20AC]/g, "")
    .replace(/ {2,}/g, " ")
    .trim();
}

function firstSentence(text: string): string {
  const idx = text.indexOf(".");
  return idx === -1 ? text : text.slice(0, idx + 1);
}

interface RadarPDFButtonProps {
  bilan: RadarBilan;
  pillarScores: PillarScore[];
  topPriorities: TopPriority[];
}

/** Génère et télécharge le rapport PDF premium du bilan, côté client uniquement (jsPDF en import dynamique). */
export function RadarPDFButton({ bilan, pillarScores, topPriorities }: RadarPDFButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setIsGenerating(true);
    setError(null);

    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const contentWidth = pageWidth - MARGIN_X * 2;

      let y = MARGIN_TOP;

      const paintBackground = () => {
        doc.setFillColor(...NOIR);
        doc.rect(0, 0, pageWidth, pageHeight, "F");
      };

      const ensureSpace = (needed: number) => {
        if (y + needed > pageHeight - MARGIN_BOTTOM) {
          doc.addPage();
          paintBackground();
          y = MARGIN_TOP;
        }
      };

      paintBackground();

      // 1. En-tête
      doc.setTextColor(...OR);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text(clean("Rapport Renaissance Radar™"), MARGIN_X, y);
      y += 7;

      doc.setTextColor(...GRIS);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(clean(`Bilan du ${formatDate(bilan.created_at)}`), MARGIN_X, y);
      y += 12;

      // 2. État dominant
      const etat = EVOLUTION_STATES[bilan.etat];
      doc.setTextColor(...IVOIRE);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(15);
      doc.text(clean(`État dominant : ${etat.label}`), MARGIN_X, y);
      y += 7;

      doc.setFont("times", "italic");
      doc.setFontSize(11);
      const etatShortLines = doc.splitTextToSize(clean(firstSentence(ETAT_MESSAGES[bilan.etat])), contentWidth);
      doc.text(etatShortLines, MARGIN_X, y);
      y += etatShortLines.length * 5.5 + 10;

      // 3. Fenêtre de Transformation
      const fenetrePct = Math.round(bilan.fenetre_transformation * 100);
      doc.setTextColor(...OR);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Fenêtre de Transformation", MARGIN_X, y);
      y += 7;

      doc.setTextColor(...IVOIRE);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(clean(`${fenetrePct}% — ${fenetreInterpretation(bilan.fenetre_transformation)}`), MARGIN_X, y);
      y += 12;

      // 4. Scores par pilier
      ensureSpace(8 + PILIERS.length * 6.5);
      doc.setTextColor(...OR);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Scores par pilier", MARGIN_X, y);
      y += 8;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10.5);
      for (const cercle of CERCLES) {
        for (const pilier of PILIERS.filter((p) => p.cercle === cercle.id)) {
          const score = pillarScores.find((s) => s.pilierId === pilier.id);
          const pct = score ? Math.round(score.ratio * 100) : 0;
          doc.setTextColor(...IVOIRE);
          doc.text(clean(`${pilier.nom} (${cercle.nom})`), MARGIN_X, y);
          doc.setTextColor(...CERCLE_RGB[pilier.cercle]);
          doc.text(`${pct}%`, pageWidth - MARGIN_X, y, { align: "right" });
          y += 6.5;
        }
      }
      y += 6;

      // 5. Top 3 zones prioritaires
      ensureSpace(8 + topPriorities.length * 16);
      doc.setTextColor(...OR);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Top 3 zones prioritaires", MARGIN_X, y);
      y += 8;

      for (const [i, priority] of topPriorities.entries()) {
        const pilier = PILIERS.find((p) => p.id === priority.pilierId);
        if (!pilier) continue;
        const pct = Math.round(priority.ratio * 100);

        ensureSpace(16);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(...IVOIRE);
        doc.text(clean(`${i + 1}. ${pilier.nom} — ${pct}%`), MARGIN_X, y);
        y += 5.5;

        doc.setFont("times", "italic");
        doc.setFontSize(10);
        doc.setTextColor(...GRIS);
        const reasonLines = doc.splitTextToSize(clean(PRIORITY_REASONS[priority.pilierId] ?? ""), contentWidth);
        doc.text(reasonLines, MARGIN_X, y);
        y += reasonLines.length * 5 + 4;
      }
      y += 4;

      // 6. Protocole recommandé (pilier prioritaire n°1)
      const topPriority = topPriorities[0];
      const protocol = topPriority ? MICRO_PROTOCOLS[topPriority.pilierId] : undefined;

      if (protocol) {
        ensureSpace(16);
        doc.setTextColor(...OR);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("Protocole recommandé", MARGIN_X, y);
        y += 8;

        for (const acte of [protocol.acte1, protocol.acte2]) {
          if (!acte) continue;
          ensureSpace(20);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(11);
          doc.setTextColor(...IVOIRE);
          doc.text(clean(acte.nom), MARGIN_X, y);
          y += 5;

          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.setTextColor(...GRIS);
          doc.text(clean(acte.frequence), MARGIN_X, y);
          y += 5;

          doc.setFont("times", "normal");
          doc.setFontSize(10.5);
          doc.setTextColor(...IVOIRE);
          const descLines = doc.splitTextToSize(clean(acte.description), contentWidth);
          doc.text(descLines, MARGIN_X, y);
          y += descLines.length * 5 + 6;
        }
      }

      // 7. Message final
      ensureSpace(16);
      doc.setTextColor(...OR);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Message final", MARGIN_X, y);
      y += 8;

      doc.setFont("times", "italic");
      doc.setFontSize(11);
      doc.setTextColor(...IVOIRE);
      const finalLines = doc.splitTextToSize(clean(ETAT_MESSAGES[bilan.etat]), contentWidth);
      doc.text(finalLines, MARGIN_X, y);
      y += finalLines.length * 5.5;

      // 8. Footer (sur chaque page)
      const pageCount = doc.getNumberOfPages();
      const footerLines = doc.splitTextToSize(clean(FOOTER_TEXT), contentWidth);
      for (let page = 1; page <= pageCount; page += 1) {
        doc.setPage(page);
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8);
        doc.setTextColor(...GRIS);
        doc.text(footerLines, MARGIN_X, pageHeight - 12);
      }

      // Téléchargement : méthode standard, avec ouverture dans un onglet en secours (iPhone).
      const filename = `radar-renaissance-${String(bilan.created_at).slice(0, 10)}.pdf`;
      const blob = doc.output("blob");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.rel = "noopener";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        window.open(url, "_blank");
      }
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (e) {
      console.error("Génération du PDF Radar impossible :", e);
      const detail = e instanceof Error ? e.message : String(e);
      setError(`Le PDF n'a pas pu être généré. Réessaie dans un instant. (${detail})`);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={isGenerating}
        className="rounded-full bg-rr-or px-8 py-3 text-xs uppercase tracking-[0.25em] text-rr-noir transition-all duration-300 hover:-translate-y-0.5 hover:bg-rr-or-clair disabled:opacity-50"
      >
        {isGenerating ? "Génération..." : "Télécharger mon rapport PDF"}
      </button>
      {error && <p className="max-w-sm text-center text-sm text-rr-rouge">{error}</p>}
    </div>
  );
}
