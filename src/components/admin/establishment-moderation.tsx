import type { Establishment } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  approveEstablishment,
  generateClaimInvite,
  rejectEstablishment,
  suspendEstablishment,
  toggleVerified,
  updateEstablishmentPlan,
} from "@/lib/actions/admin-establishments";
import { ESTABLISHMENT_PLAN_LABELS, ESTABLISHMENT_STATUS_LABELS } from "@/lib/establishment";

const inputClass =
  "w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-blue";
const labelClass = "mb-1 block text-sm font-medium text-neutral-700";

const STATUS_BADGE_CLASS: Record<string, string> = {
  ACTIVE: "bg-brand-green-light text-brand-green-dark",
  PENDING_REVIEW: "bg-amber-100 text-amber-700",
  SUSPENDED: "bg-red-100 text-red-700",
  REJECTED: "bg-red-100 text-red-700",
};

export function EstablishmentModeration({ establishment }: { establishment: Establishment }) {
  const claimUrl = establishment.claimToken
    ? `/etablissements/revendiquer/${establishment.claimToken}`
    : null;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Statut</CardTitle>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_BADGE_CLASS[establishment.status]}`}
          >
            {ESTABLISHMENT_STATUS_LABELS[establishment.status]}
          </span>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {establishment.ownerUserId ? (
            <p className="text-sm text-neutral-500">Fiche revendiquée par son propriétaire.</p>
          ) : (
            <p className="text-sm text-neutral-500">
              Aucun propriétaire lié (fiche ajoutée par l&apos;équipe).
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            {establishment.status !== "ACTIVE" && (
              <form action={approveEstablishment.bind(null, establishment.id)}>
                <Button type="submit" size="sm">
                  Valider
                </Button>
              </form>
            )}
            {establishment.status !== "SUSPENDED" && establishment.status === "ACTIVE" && (
              <form action={suspendEstablishment.bind(null, establishment.id)}>
                <Button type="submit" variant="outline" size="sm">
                  Suspendre
                </Button>
              </form>
            )}
            <form action={toggleVerified.bind(null, establishment.id, establishment.verified)}>
              <Button type="submit" variant="outline" size="sm">
                {establishment.verified ? "Retirer la vérification" : "Marquer comme vérifié"}
              </Button>
            </form>
          </div>

          {establishment.status !== "REJECTED" && (
            <form
              action={rejectEstablishment.bind(null, establishment.id)}
              className="flex flex-col gap-2 border-t border-black/5 pt-3"
            >
              <label className={labelClass}>Rejeter avec un motif</label>
              <textarea name="rejectionReason" rows={2} className={inputClass} />
              <Button type="submit" variant="outline" size="sm" className="w-fit">
                Rejeter
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Formule</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={updateEstablishmentPlan.bind(null, establishment.id)}
            className="flex flex-wrap items-end gap-3"
          >
            <div>
              <label className={labelClass}>Plan</label>
              <select name="plan" defaultValue={establishment.plan} className={inputClass}>
                {Object.entries(ESTABLISHMENT_PLAN_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Expiration</label>
              <input
                type="date"
                name="planExpiresAt"
                defaultValue={
                  establishment.planExpiresAt
                    ? establishment.planExpiresAt.toISOString().slice(0, 10)
                    : ""
                }
                className={inputClass}
              />
            </div>
            <Button type="submit" size="sm">
              Enregistrer
            </Button>
          </form>
        </CardContent>
      </Card>

      {!establishment.ownerUserId && (
        <Card>
          <CardHeader>
            <CardTitle>Inviter à revendiquer la fiche</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <form
              action={generateClaimInvite.bind(null, establishment.id)}
              className="flex flex-wrap items-end gap-3"
            >
              <div className="flex-1">
                <label className={labelClass}>Email de l&apos;établissement</label>
                <input
                  type="email"
                  name="claimInviteEmail"
                  defaultValue={establishment.claimInviteEmail ?? ""}
                  className={inputClass}
                />
              </div>
              <Button type="submit" size="sm">
                Générer le lien
              </Button>
            </form>
            {claimUrl && (
              <p className="text-sm text-neutral-600">
                Lien à transmettre : <span className="font-mono text-brand-blue">{claimUrl}</span>
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
