import type { Metadata } from "next";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { deleteChapter } from "@/lib/actions/admin-bac-chapters";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Chapitres BAC" };

export default async function AdminChaptersPage({
  searchParams,
}: {
  searchParams: Promise<{ subjectId?: string }>;
}) {
  const { subjectId } = await searchParams;

  const [chapters, subjects] = await Promise.all([
    prisma.chapter.findMany({
      where: subjectId ? { subjectId } : undefined,
      orderBy: [{ subjectId: "asc" }, { order: "asc" }],
      include: { subject: true },
    }),
    prisma.subject.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <form className="flex items-center gap-2">
          <select
            name="subjectId"
            defaultValue={subjectId ?? ""}
            className="rounded-lg border border-black/10 px-3 py-2 text-sm text-neutral-700"
          >
            <option value="">Toutes les matières</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
          <Button type="submit" variant="outline" size="sm">
            Filtrer
          </Button>
        </form>
        <Button asChild size="sm">
          <Link href="/admin/bac/chapitres/nouveau">Nouveau chapitre</Link>
        </Button>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-black/5 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/5 text-xs uppercase text-neutral-500">
            <tr>
              <th className="px-4 py-3">Chapitre</th>
              <th className="px-4 py-3">Matière</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {chapters.map((chapter) => (
              <tr key={chapter.id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3 font-medium text-neutral-900">{chapter.name}</td>
                <td className="px-4 py-3 text-neutral-600">{chapter.subject.name}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      chapter.isActive
                        ? "rounded-full bg-brand-green-light px-2.5 py-1 text-xs font-medium text-brand-green-dark"
                        : "rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500"
                    }
                  >
                    {chapter.isActive ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/bac/chapitres/${chapter.id}`}>
                        <Pencil className="size-4" />
                      </Link>
                    </Button>
                    <form action={deleteChapter.bind(null, chapter.id)}>
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
