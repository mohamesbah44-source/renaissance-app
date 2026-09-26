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
    <form ref={formRef} action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="recipientId" value={recipientId} />

      <Textarea name="content" rows={3} placeholder="Écris ton message..." required />

      {state?.error && <p className="text-sm text-rr-rouge">{state.error}</p>}

      <SubmitButton className="w-auto self-end px-8">Envoyer</SubmitButton>
    </form>
  );
}
