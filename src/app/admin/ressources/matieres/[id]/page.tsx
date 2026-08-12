import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ResourceSubjectForm } from "@/components/admin/resource-subject-form";
import { updateResourceSubject } from "@/lib/actions/admin-resource-subjects";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Modifier la matière" };

export default async function EditResourceSubjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const subject = await prisma.resourceSubject.findUnique({ where: { id } });
  if (!subject) {
    notFound();
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-900">Modifier {subject.name}</h2>
      <div className="mt-4 max-w-xl">
        <ResourceSubjectForm
          subject={subject}
          action={updateResourceSubject.bind(null, id)}
          error={error}
        />
      </div>
    </div>
  );
}
