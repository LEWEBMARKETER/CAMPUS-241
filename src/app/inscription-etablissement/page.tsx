import type { Metadata } from "next";
import Link from "next/link";

import { EstablishmentSignupForm } from "@/components/etablissement/establishment-signup-form";

export const metadata: Metadata = { title: "Inscrire mon établissement" };

export default function EstablishmentSignupPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-neutral-900">Inscrire mon établissement</h1>
      <p className="mt-2 text-neutral-600">
        Créez votre fiche établissement et gérez-la vous-même : informations, filières, contact.
      </p>

      <div className="mt-8">
        <EstablishmentSignupForm />
      </div>

      <p className="mt-6 text-sm text-neutral-600">
        Déjà un compte ?{" "}
        <Link href="/connexion" className="font-medium text-brand-blue hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
