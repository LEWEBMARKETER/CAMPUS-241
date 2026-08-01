"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { registerUser, type RegisterState } from "@/lib/actions/auth";

const inputClass =
  "w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-blue";
const labelClass = "mb-1 block text-sm font-medium text-neutral-700";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState<RegisterState, FormData>(
    registerUser,
    null,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Nom</label>
          <input type="text" name="nom" required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Prénom</label>
          <input type="text" name="prenom" required className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Email</label>
        <input type="email" name="email" required className={inputClass} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>WhatsApp</label>
          <input type="tel" name="whatsapp" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Date de naissance</label>
          <input type="date" name="dateNaissance" className={inputClass} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Niveau</label>
          <select name="niveau" className={inputClass} defaultValue="">
            <option value="">Sélectionner</option>
            <option value="College">Collège</option>
            <option value="Lycee">Lycée</option>
            <option value="Universite">Université</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Classe / niveau universitaire</label>
          <input
            type="text"
            name="classeOuNiveauUniv"
            placeholder="Ex: Terminale, Licence 2..."
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Série</label>
          <input type="text" name="serie" placeholder="Ex: Série D" className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Ville</label>
        <input type="text" name="ville" className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Mot de passe</label>
        <input
          type="password"
          name="password"
          required
          minLength={8}
          className={inputClass}
        />
        <p className="mt-1 text-xs text-neutral-500">8 caractères minimum.</p>
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Création du compte..." : "Créer mon compte"}
      </Button>
    </form>
  );
}
