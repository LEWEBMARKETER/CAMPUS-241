import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdvisorForm } from "@/components/admin/advisor-form";
import { updateAdvisor } from "@/lib/actions/admin-advisors";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Modifier le conseiller" };

export default async function EditAdvisorPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const advisor = await prisma.advisor.findUnique({ where: { id } });
  if (!advisor) {
    notFound();
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-900">
        Modifier {advisor.name}
      </h2>
      <div className="mt-4 max-w-2xl">
        <AdvisorForm
          advisor={advisor}
          action={updateAdvisor.bind(null, id)}
          error={error}
        />
      </div>
    </div>
  );
}
