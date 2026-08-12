import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { claimEstablishment } from "@/lib/actions/establishment-owner";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Revendiquer ma fiche établissement" };

export default async function ClaimEstablishmentPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const establishment = await prisma.establishment.findUnique({ where: { claimToken: token } });
  if (!establishment || establishment.ownerUserId || establishment.claimedAt) {
    notFound();
  }

  const session = await auth();

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Revendiquer {establishment.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-neutral-600">
            Cette fiche a été ajoutée à l&apos;annuaire CAMPUS 241 par notre équipe. Revendiquez-la
            pour pouvoir la gérer vous-même.
          </p>

          {session?.user ? (
            <form action={claimEstablishment.bind(null, token)}>
              <Button type="submit" className="w-full">
                Revendiquer cette fiche avec {session.user.email}
              </Button>
            </form>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-neutral-600">
                Connectez-vous ou créez un compte, puis revenez sur ce lien pour finaliser la
                revendication.
              </p>
              <div className="flex gap-2">
                <Button asChild className="flex-1">
                  <Link href="/connexion">Se connecter</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/inscription">Créer un compte</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
