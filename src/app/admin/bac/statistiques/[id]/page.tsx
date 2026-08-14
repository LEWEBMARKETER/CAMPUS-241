import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BacStatisticForm } from "@/components/admin/bac-statistic-form";
import { updateBacStatistic } from "@/lib/actions/admin-bac-statistics";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Modifier la statistique" };

export default async function EditBacStatisticPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const { error } = await searchParams;

  const [statistic, allSeries] = await Promise.all([
    prisma.bacStatistic.findUnique({ where: { id } }),
    prisma.series.findMany({ orderBy: { order: "asc" } }),
  ]);
  if (!statistic) {
    notFound();
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-900">
        Modifier la statistique {statistic.year}
      </h2>
      <div className="mt-4 max-w-2xl">
        <BacStatisticForm
          statistic={statistic}
          allSeries={allSeries}
          action={updateBacStatistic.bind(null, id)}
          error={error}
        />
      </div>
    </div>
  );
}
