import type { Metadata } from "next";

import { BacStatisticForm } from "@/components/admin/bac-statistic-form";
import { createBacStatistic } from "@/lib/actions/admin-bac-statistics";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Nouvelle statistique" };

export default async function NewBacStatisticPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin();
  const { error } = await searchParams;
  const allSeries = await prisma.series.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-900">Nouvelle statistique officielle</h2>
      <div className="mt-4 max-w-2xl">
        <BacStatisticForm allSeries={allSeries} action={createBacStatistic} error={error} />
      </div>
    </div>
  );
}
