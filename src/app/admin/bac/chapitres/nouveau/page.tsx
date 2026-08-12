import type { Metadata } from "next";

import { ChapterForm } from "@/components/admin/chapter-form";
import { createChapter } from "@/lib/actions/admin-bac-chapters";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Nouveau chapitre" };

export default async function NewChapterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const subjects = await prisma.subject.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-900">Nouveau chapitre</h2>
      <div className="mt-4 max-w-xl">
        <ChapterForm subjects={subjects} action={createChapter} error={error} />
      </div>
    </div>
  );
}
