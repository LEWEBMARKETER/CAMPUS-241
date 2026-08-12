"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import {
  registerEstablishment,
  type EstablishmentSignupState,
} from "@/lib/actions/establishment-owner";
import { ESTABLISHMENT_TYPE_LABELS } from "@/lib/establishment";

const inputClass =
  "w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-blue";
const labelClass = "mb-1 block text-sm font-medium text-neutral-700";

export function EstablishmentSignupForm() {
  const [state, formAction, pending] = useActionState<EstablishmentSignupState, FormData>(
    registerEstablishment,
    null,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <p className="text-sm font-semibold text-neutral-900">Votre compte</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Prénom</label>
          <input type="text" name="prenom" required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Nom</label>
          <input type="text" name="nom" required className={inputClass} />
        </div>
      </div>
      <div>
        <label className={labelClass}>Email</label>
        <input type="email" name="email" required className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Mot de passe</label>
        <input type="password" name="password" required minLength={8} className={inputClass} />
        <p className="mt-1 text-xs text-neutral-500">8 caractères minimum.</p>
      </div>

      <p className="mt-2 text-sm font-semibold text-neutral-900">Votre établissement</p>
      <div>
        <label className={labelClass}>Nom de l&apos;établissement</label>
        <input type="text" name="name" required className={inputClass} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Type</label>
          <select name="type" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              Sélectionner
            </option>
            {Object.entries(ESTABLISHMENT_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Ville</label>
          <input type="text" name="city" className={inputClass} />
        </div>
      </div>
      <div>
        <label className={labelClass}>Adresse</label>
        <input type="text" name="address" className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Description</label>
        <textarea name="description" rows={3} className={inputClass} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Téléphone de contact</label>
          <input type="tel" name="contactPhone" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Site web</label>
          <input type="text" name="websiteUrl" placeholder="https://…" className={inputClass} />
        </div>
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <p className="text-xs text-neutral-500">
        Votre fiche sera visible dans l&apos;annuaire après validation par notre équipe.
      </p>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Création..." : "Créer ma fiche établissement"}
      </Button>
    </form>
  );
}
