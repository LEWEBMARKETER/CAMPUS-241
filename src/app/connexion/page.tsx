import type { Metadata } from "next";
import Link from "next/link";

import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Connexion" };

export default function ConnexionPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-neutral-900">Connexion</h1>
      <p className="mt-2 text-neutral-600">
        Accédez à votre espace élève/étudiant CAMPUS 241.
      </p>

      <div className="mt-8">
        <LoginForm />
      </div>

      <p className="mt-6 text-sm text-neutral-600">
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="font-medium text-brand-blue hover:underline">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
