"use client";

import { useActionState } from "react";
import { RefreshCw } from "lucide-react";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { importAnalyzerBilan } from "@/lib/analyzer/actions";

/** Importe le dernier bilan Re-Naissance Analyzer™ du client dans son Radar. */
export function ImportAnalyzerButton({ clientId }: { clientId: string }) {
  const [state, formAction] = useActionState(importAnalyzerBilan, undefined);

  return (
    <form action={formAction} className="flex flex-col items-start gap-2">
      <input type="hidden" name="clientId" value={clientId} />
      <SubmitButton variant="outline" className="w-auto">
        <RefreshCw className="h-4 w-4" strokeWidth={1.75} />
        Importer depuis l&apos;Analyzer
      </SubmitButton>
      {state?.error && <p className="text-sm text-rr-rouge">{state.error}</p>}
      {state?.info && <p className="text-sm text-rr-gris-clair">{state.info}</p>}
      {state?.success && <p className="text-sm text-rr-or-clair">Bilan importé et ajouté au Carnet.</p>}
    </form>
  );
}
