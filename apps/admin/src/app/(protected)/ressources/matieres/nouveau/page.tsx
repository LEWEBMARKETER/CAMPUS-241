import type { Metadata } from "next";

import { ResourceSubjectForm } from "@/components/admin/resource-subject-form";
import { createResourceSubject } from "@/lib/actions/admin-resource-subjects";

export const metadata: Metadata = { title: "Nouvelle matière" };

export default async function NewResourceSubjectPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-900">Nouvelle matière</h2>
      <div className="mt-4 max-w-xl">
        <ResourceSubjectForm action={createResourceSubject} error={error} />
      </div>
    </div>
  );
}
