import type { Metadata } from "next";
import Link from "next/link";

import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = { title: "Inscription" };

export default function InscriptionPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-neutral-900">Créer mon compte</h1>
      <p className="mt-2 text-neutral-600">
        Accédez à votre espace élève/étudiant : favoris, ressources gratuites
        et suivi personnalisé.
      </p>

      <div className="mt-8">
        <RegisterForm />
      </div>

      <p className="mt-6 text-sm text-neutral-600">
        Déjà un compte ?{" "}
        <Link href="/connexion" className="font-medium text-brand-blue hover:underline">
          Se connecter
        </Link>
      </p>
      <p className="mt-2 text-sm text-neutral-600">
        Vous représentez un établissement ?{" "}
        <Link
          href="/inscription-etablissement"
          className="font-medium text-brand-blue hover:underline"
        >
          Inscrire mon établissement
        </Link>
      </p>
    </div>
  );
}
