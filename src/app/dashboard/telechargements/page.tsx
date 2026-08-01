import type { Metadata } from "next";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DownloadLink } from "@/components/dashboard/download-link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Mes téléchargements" };

export default async function TelechargementsPage() {
  const user = await requireUser();

  const [leadMagnets, downloads] = await Promise.all([
    prisma.leadMagnet.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.download.findMany({ where: { userId: user.id } }),
  ]);

  const downloadedIds = new Set(downloads.map((d) => d.leadMagnetId));

  if (leadMagnets.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-black/10 p-12 text-center text-neutral-500">
        Aucune ressource gratuite disponible pour le moment.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {leadMagnets.map((leadMagnet) => (
        <Card key={leadMagnet.id}>
          <CardHeader>
            <CardTitle className="text-base">{leadMagnet.title}</CardTitle>
            {leadMagnet.description && (
              <CardDescription>{leadMagnet.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <DownloadLink
              leadMagnetId={leadMagnet.id}
              fileUrl={leadMagnet.fileUrl}
              downloaded={downloadedIds.has(leadMagnet.id)}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
