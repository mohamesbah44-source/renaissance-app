"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight } from "lucide-react";
import { sendMessage } from "@/lib/messages/actions";

function SendButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-label="Envoyer"
      className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-rr-or text-rr-noir transition-opacity duration-300 hover:opacity-90 disabled:opacity-50"
    >
      <ArrowRight className="h-5 w-5" strokeWidth={1.8} />
    </button>
  );
}

export function MessageComposer({
  recipientId,
  recipientName,
}: {
  recipientId: string;
  recipientName?: string;
}) {
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

      <div className="flex items-center gap-2.5">
        <input
          type="text"
          name="content"
          required
          autoComplete="off"
          aria-label="Ton message"
          placeholder={recipientName ? `Écrire à ${recipientName}` : "Écris ton message…"}
          className="h-[50px] min-w-0 flex-1 rounded-full border border-rr-ivoire/[0.16] bg-white/[0.05] px-5 text-[15px] text-rr-ivoire placeholder:text-rr-gris focus:border-rr-or/50 focus:outline-none"
        />
        <SendButton />
      </div>

      {state?.error && <p className="px-3 text-sm text-rr-rouge">{state.error}</p>}
    </form>
  );
}
