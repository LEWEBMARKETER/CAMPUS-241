import type { Metadata } from "next";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Mon profil" };

export default async function DashboardPage() {
  const sessionUser = await requireUser();
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: sessionUser.id },
  });

  const fields: { label: string; value: string }[] = [
    { label: "Nom", value: user.nom },
    { label: "Prénom", value: user.prenom },
    { label: "Email", value: user.email },
    { label: "WhatsApp", value: user.whatsapp ?? "—" },
    {
      label: "Date de naissance",
      value: user.dateNaissance
        ? new Intl.DateTimeFormat("fr-FR").format(user.dateNaissance)
        : "—",
    },
    { label: "Niveau", value: user.niveau ?? "—" },
    { label: "Classe / niveau universitaire", value: user.classeOuNiveauUniv ?? "—" },
    { label: "Série", value: user.serie ?? "—" },
    { label: "Ville", value: user.ville ?? "—" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profil utilisateur</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.label}>
              <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                {field.label}
              </dt>
              <dd className="mt-1 text-sm text-neutral-900">{field.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
