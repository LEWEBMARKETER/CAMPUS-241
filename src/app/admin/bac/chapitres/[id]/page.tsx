import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ChapterForm } from "@/components/admin/chapter-form";
import { updateChapter } from "@/lib/actions/admin-bac-chapters";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Modifier le chapitre" };

export default async function EditChapterPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const [chapter, subjects] = await Promise.all([
    prisma.chapter.findUnique({ where: { id } }),
    prisma.subject.findMany({ orderBy: { order: "asc" } }),
  ]);
  if (!chapter) {
    notFound();
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-900">Modifier {chapter.name}</h2>
      <div className="mt-4 max-w-xl">
        <ChapterForm
          chapter={chapter}
          subjects={subjects}
          action={updateChapter.bind(null, id)}
          error={error}
        />
      </div>
    </div>
  );
}
