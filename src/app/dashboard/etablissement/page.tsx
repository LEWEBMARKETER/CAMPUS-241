import type { Metadata } from "next";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { OwnEstablishmentForm } from "@/components/etablissement/own-establishment-form";
import { updateOwnEstablishment } from "@/lib/actions/establishment-owner";
import { ESTABLISHMENT_PLAN_LABELS, ESTABLISHMENT_STATUS_LABELS } from "@/lib/establishment";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Mon établissement" };

const STATUS_BADGE_CLASS: Record<string, string> = {
  ACTIVE: "bg-brand-green-light text-brand-green-dark",
  PENDING_REVIEW: "bg-amber-100 text-amber-700",
  SUSPENDED: "bg-red-100 text-red-700",
  REJECTED: "bg-red-100 text-red-700",
};

export default async function DashboardEstablishmentPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await requireUser();
  const { error } = await searchParams;

  const establishment = await prisma.establishment.findFirst({
    where: { ownerUserId: user.id },
  });

  if (!establishment) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-neutral-900">Mon établissement</h2>
        <div className="mt-4 rounded-2xl border border-dashed border-black/10 p-12 text-center text-neutral-500">
          Vous ne gérez aucune fiche établissement pour le moment.{" "}
          <Link
            href="/inscription-etablissement"
            className="font-medium text-brand-blue hover:underline"
          >
            Inscrire mon établissement
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-6">
          <div>
            <p className="text-lg font-semibold text-neutral-900">{establishment.name}</p>
            <p className="mt-1 text-sm text-neutral-600">
              Formule : {ESTABLISHMENT_PLAN_LABELS[establishment.plan]}
              {establishment.planExpiresAt
                ? ` (expire le ${new Intl.DateTimeFormat("fr-FR").format(establishment.planExpiresAt)})`
                : ""}
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_BADGE_CLASS[establishment.status]}`}
          >
            {ESTABLISHMENT_STATUS_LABELS[establishment.status]}
          </span>
        </CardContent>
        {establishment.status === "REJECTED" && establishment.rejectionReason && (
          <CardContent className="pt-0">
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              Motif du rejet : {establishment.rejectionReason}
            </p>
          </CardContent>
        )}
        {establishment.status === "PENDING_REVIEW" && (
          <CardContent className="pt-0">
            <p className="text-sm text-neutral-500">
              Votre fiche est en cours de validation par notre équipe. Elle ne sera visible dans
              l&apos;annuaire qu&apos;une fois activée.
            </p>
          </CardContent>
        )}
      </Card>

      <div>
        <h2 className="text-lg font-semibold text-neutral-900">Modifier ma fiche</h2>
        <div className="mt-3 max-w-2xl">
          <OwnEstablishmentForm
            establishment={establishment}
            action={updateOwnEstablishment.bind(null, establishment.id)}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}
