"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import {
  requestBrochure,
  type BrochureRequestState,
} from "@/lib/actions/brochure-request";

export function BrochureRequestForm({
  establishmentId,
}: {
  establishmentId: string;
}) {
  const [state, formAction, pending] = useActionState<
    BrochureRequestState,
    FormData
  >(requestBrochure, null);

  if (state?.success) {
    return (
      <p className="rounded-lg bg-brand-green-light px-4 py-3 text-sm font-medium text-brand-green-dark">
        Merci ! Votre demande de brochure a bien été envoyée.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="establishmentId" value={establishmentId} />
      <input
        type="text"
        name="name"
        placeholder="Votre nom"
        required
        className="rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-blue"
      />
      <input
        type="email"
        name="email"
        placeholder="Votre email"
        required
        className="rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-blue"
      />
      <input
        type="tel"
        name="whatsapp"
        placeholder="WhatsApp (optionnel)"
        className="rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-blue"
      />
      {state?.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}
      <Button type="submit" disabled={pending}>
        {pending ? "Envoi..." : "Demander la brochure"}
      </Button>
    </form>
  );
}
