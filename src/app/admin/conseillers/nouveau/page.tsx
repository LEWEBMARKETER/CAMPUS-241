import type { Metadata } from "next";

import { AdvisorForm } from "@/components/admin/advisor-form";
import { createAdvisor } from "@/lib/actions/admin-advisors";

export const metadata: Metadata = { title: "Nouveau conseiller" };

export default async function NewAdvisorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-900">Nouveau conseiller</h2>
      <div className="mt-4 max-w-2xl">
        <AdvisorForm action={createAdvisor} error={error} />
      </div>
    </div>
  );
}
