import type { Metadata } from "next";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Tableau de bord admin" };

export default async function AdminDashboardPage() {
  const [
    establishmentsCount,
    proEstablishmentsCount,
    usersCount,
    brochureRequestsCount,
    questionsCount,
    simulationsCount,
    resourcesCount,
  ] = await Promise.all([
    prisma.establishment.count(),
    prisma.establishment.count({ where: { plan: { in: ["PRO", "PREMIUM"] } } }),
    prisma.user.count(),
    prisma.brochureRequest.count(),
    prisma.question.count(),
    prisma.simulation.count(),
    prisma.resource.count(),
  ]);

  const stats = [
    { label: "Établissements", value: establishmentsCount },
    { label: "Dont PRO/PREMIUM", value: proEstablishmentsCount },
    { label: "Utilisateurs inscrits", value: usersCount },
    { label: "Demandes de brochure", value: brochureRequestsCount },
    { label: "Questions BAC", value: questionsCount },
    { label: "Simulations réalisées", value: simulationsCount },
    { label: "Ressources", value: resourcesCount },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-neutral-500">
              {stat.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
