"use client";

import { useActionState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/Textarea";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { sendMessage } from "@/lib/messages/actions";

export function MessageComposer({ recipientId }: { recipientId: string }) {
  const [state, formAction] = useActionState(sendMessage, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-col gap-2 rounded-[28px] border border-rr-or/[0.14] p-3"
    >
      <input type="hidden" name="recipientId" value={recipientId} />

      <div className="flex items-end gap-2">
        <div className="min-w-0 flex-1">
          <Textarea name="content" rows={2} placeholder="Écris ton message…" required />
        </div>
        <SubmitButton className="w-auto shrink-0 px-6">Envoyer</SubmitButton>
      </div>

      {state?.error && <p className="px-1 text-sm text-rr-rouge">{state.error}</p>}
    </form>
  );
}
