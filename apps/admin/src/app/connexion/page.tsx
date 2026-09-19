import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Connexion" };

export default function ConnexionPage() {
  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-neutral-900">Back-office</h1>
      <p className="mt-2 text-neutral-600">
        Connexion réservée à l&apos;équipe CAMPUS 241.
      </p>

      <div className="mt-8">
        <LoginForm />
      </div>
    </div>
  );
}
