import type { Metadata } from "next";
import Link from "next/link";
import { Download } from "lucide-react";

import { RESOURCE_TYPE_LABELS } from "@/lib/resources";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Mes téléchargements" };

export default async function DashboardDownloadsPage() {
  const sessionUser = await requireUser();

  const downloads = await prisma.resourceDownload.findMany({
    where: { userId: sessionUser.id },
    include: { resource: true },
    orderBy: { downloadedAt: "desc" },
  });

  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-900">Mes téléchargements</h2>

      {downloads.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-black/10 p-12 text-center text-neutral-500">
          Vous n&apos;avez encore téléchargé aucune ressource.{" "}
          <Link href="/ressources" className="font-medium text-brand-blue hover:underline">
            Explorer CAMPUS RESSOURCES
          </Link>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-2xl border border-black/5 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/5 text-xs uppercase text-neutral-500">
              <tr>
                <th className="px-4 py-3">Ressource</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {downloads.map((download) => (
                <tr key={download.id} className="border-b border-black/5 last:border-0">
                  <td className="px-4 py-3 font-medium text-neutral-900">
                    {download.resource.title}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {RESOURCE_TYPE_LABELS[download.resource.type]}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {new Intl.DateTimeFormat("fr-FR").format(download.downloadedAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/ressources/${download.resource.slug}`}
                      className="inline-flex items-center gap-1 font-medium text-brand-blue hover:underline"
                    >
                      <Download className="size-4" />
                      Revoir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
