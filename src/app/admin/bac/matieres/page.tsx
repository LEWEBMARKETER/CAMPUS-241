import type { Metadata } from "next";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { deleteSubject } from "@/lib/actions/admin-bac-subjects";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Matières BAC" };

export default async function AdminSubjectsPage() {
  const subjects = await prisma.subject.findMany({
    orderBy: { order: "asc" },
    include: { series: { include: { series: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          {subjects.length} matière{subjects.length > 1 ? "s" : ""}
        </p>
        <Button asChild size="sm">
          <Link href="/admin/bac/matieres/nouveau">Nouvelle matière</Link>
        </Button>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-black/5 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/5 text-xs uppercase text-neutral-500">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Séries</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject) => (
              <tr key={subject.id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3 font-medium text-neutral-900">{subject.name}</td>
                <td className="px-4 py-3 text-neutral-600">
                  {subject.series.map((s) => s.series.code).join(", ") || "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      subject.isActive
                        ? "rounded-full bg-brand-green-light px-2.5 py-1 text-xs font-medium text-brand-green-dark"
                        : "rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500"
                    }
                  >
                    {subject.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/bac/matieres/${subject.id}`}>
                        <Pencil className="size-4" />
                      </Link>
                    </Button>
                    <form action={deleteSubject.bind(null, subject.id)}>
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
