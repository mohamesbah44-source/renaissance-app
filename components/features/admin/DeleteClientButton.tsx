"use client";

import { useActionState, useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteClient } from "@/lib/admin/delete-client";

/** Suppression d'un·e participant·e en deux temps, pour éviter toute erreur au doigt. */
export function DeleteClientButton({ clientId, clientName }: { clientId: string; clientName: string }) {
  const [confirming, setConfirming] = useState(false);
  const [state, formAction, pending] = useActionState(deleteClient, undefined);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="flex items-center gap-2 self-start rounded-full border border-rr-rouge/40 px-5 py-3 text-xs uppercase tracking-[0.2em] text-rr-rouge transition-colors hover:bg-rr-rouge/10"
      >
        <Trash2 className="h-4 w-4" strokeWidth={1.75} />
        Supprimer ce participant
      </button>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4 rounded-[28px] border border-rr-rouge/30 bg-rr-encre p-6">
      <input type="hidden" name="clientId" value={clientId} />
      <p className="font-rr-serif text-lg italic leading-relaxed text-rr-ivoire">
        Supprimer {clientName} ?
      </p>
      <p className="text-sm leading-relaxed text-rr-gris-clair">
        Cette action est définitive : son accès, son journal, ses réponses et ses messages seront effacés.
      </p>

      {state?.error && <p className="text-sm text-rr-rouge">{state.error}</p>}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-rr-rouge px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-rr-ivoire transition-opacity disabled:opacity-60"
        >
          {pending ? "Suppression…" : "Oui, supprimer définitivement"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={pending}
          className="rounded-full border border-rr-or/30 px-6 py-3 text-xs uppercase tracking-[0.2em] text-rr-gris-clair transition-colors hover:text-rr-ivoire"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
