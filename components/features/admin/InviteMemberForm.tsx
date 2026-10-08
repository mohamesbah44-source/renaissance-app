"use client";

import { useActionState, useState } from "react";
import { inviteMember, type InviteState } from "@/lib/admin/invite-actions";
import { GlassCard } from "@/components/ui/GlassCard";
import { SubmitButton } from "@/components/ui/SubmitButton";

const inputClass =
  "h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-[15px] text-rr-ivoire placeholder:text-rr-gris focus:border-rr-or/50 focus:outline-none";

function welcomeMessage(firstName: string, link: string): string {
  return `Bonjour ${firstName},

Ton espace Renaissance™ est prêt. Voici ton lien personnel pour choisir ton mot de passe et entrer dans le programme :

${link}

Ce lien est personnel et valable 24 heures. Si besoin, écris-moi et je t'en envoie un nouveau.

À très vite,
Mohamed`;
}

export function InviteMemberForm({ defaultDate }: { defaultDate: string }) {
  const [state, formAction] = useActionState<InviteState | undefined, FormData>(inviteMember, undefined);
  const [copied, setCopied] = useState<"link" | "message" | null>(null);

  async function copy(text: string, which: "link" | "message") {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <GlassCard className="p-6">
        <form action={formAction} className="flex flex-col gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="first_name" className="mb-2 block text-sm text-rr-ivoire">
                Prénom
              </label>
              <input id="first_name" name="first_name" required className={inputClass} placeholder="Prénom" />
            </div>
            <div>
              <label htmlFor="last_name" className="mb-2 block text-sm text-rr-ivoire">
                Nom (facultatif)
              </label>
              <input id="last_name" name="last_name" className={inputClass} placeholder="Nom" />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm text-rr-ivoire">
              Adresse e-mail
            </label>
            <input id="email" name="email" type="email" required className={inputClass} placeholder="prenom@exemple.com" />
          </div>
          <div>
            <label htmlFor="start_date" className="mb-2 block text-sm text-rr-ivoire">
              Début du programme
            </label>
            <input id="start_date" name="start_date" type="date" required defaultValue={defaultDate} className={inputClass} />
          </div>

          {state?.error && <p className="text-sm text-rr-rouge">{state.error}</p>}

          <SubmitButton>Générer le lien d&apos;invitation</SubmitButton>
        </form>
      </GlassCard>

      {state?.link && (
        <GlassCard className="border-rr-or/30 p-6">
          <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or">
            {state.existing ? "Ce membre a déjà un compte" : "Compte créé"}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-rr-gris-clair">
            {state.existing
              ? `Voici un lien pour que ${state.firstName} redéfinisse son mot de passe.`
              : `Envoie ce lien personnel à ${state.firstName} (${state.email}). Il choisira son mot de passe et entrera directement dans l'appli.`}
          </p>
          <input
            readOnly
            value={state.link}
            onFocus={(e) => e.currentTarget.select()}
            className={`${inputClass} mt-4 text-xs`}
            aria-label="Lien d'invitation"
          />
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => copy(state.link as string, "link")}
              className="h-12 flex-1 rounded-full border border-rr-or/40 text-sm text-rr-or transition-colors hover:bg-rr-or/10"
            >
              {copied === "link" ? "Lien copié" : "Copier le lien"}
            </button>
            <button
              type="button"
              onClick={() => copy(welcomeMessage(state.firstName ?? "", state.link as string), "message")}
              className="h-12 flex-1 rounded-full border border-white/15 text-sm text-rr-gris-clair transition-colors hover:bg-white/[0.05]"
            >
              {copied === "message" ? "Message copié" : "Copier le message d'accueil"}
            </button>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
