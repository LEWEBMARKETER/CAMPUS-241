import type { Metadata } from "next";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Tableau de bord admin" };

export default async function AdminDashboardPage() {
  const [
    establishmentsCount,
    partnersCount,
    advisorsCount,
    usersCount,
    leadsCount,
    brochureRequestsCount,
    articlesCount,
  ] = await Promise.all([
    prisma.establishment.count(),
    prisma.establishment.count({ where: { isPartner: true } }),
    prisma.advisor.count(),
    prisma.user.count(),
    prisma.lead.count(),
    prisma.brochureRequest.count(),
    prisma.article.count(),
  ]);

  const stats = [
    { label: "Établissements", value: establishmentsCount },
    { label: "Dont partenaires", value: partnersCount },
    { label: "Conseillers", value: advisorsCount },
    { label: "Utilisateurs inscrits", value: usersCount },
    { label: "Leads collectés", value: leadsCount },
    { label: "Demandes de brochure", value: brochureRequestsCount },
    { label: "Articles publiés", value: articlesCount },
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
