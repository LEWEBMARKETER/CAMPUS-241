import type { Metadata } from "next";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { deleteAdvisor } from "@/lib/actions/admin-advisors";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Gestion des conseillers" };

export default async function AdminAdvisorsPage() {
  const advisors = await prisma.advisor.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          {advisors.length} conseiller{advisors.length > 1 ? "s" : ""}
        </p>
        <Button asChild size="sm">
          <Link href="/admin/conseillers/nouveau">Nouveau conseiller</Link>
        </Button>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-black/5 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/5 text-xs uppercase text-neutral-500">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Spécialité</th>
              <th className="px-4 py-3">Ville</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {advisors.map((advisor) => (
              <tr key={advisor.id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3 font-medium text-neutral-900">{advisor.name}</td>
                <td className="px-4 py-3 text-neutral-600">{advisor.specialty ?? "—"}</td>
                <td className="px-4 py-3 text-neutral-600">{advisor.city ?? "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/conseillers/${advisor.id}`}>
                        <Pencil className="size-4" />
                      </Link>
                    </Button>
                    <form action={deleteAdvisor.bind(null, advisor.id)}>
                      <Button type="submit" variant="outline" size="sm">
                        <Trash2 className="size-4" />
                      </Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
