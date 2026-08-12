"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { loginUser, type LoginState } from "@/lib/actions/auth";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    loginUser,
    null,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Email
        </label>
        <input
          type="email"
          name="email"
          required
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-blue"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Mot de passe
        </label>
        <input
          type="password"
          name="password"
          required
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-blue"
        />
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Connexion..." : "Se connecter"}
      </Button>
    </form>
  );
}
