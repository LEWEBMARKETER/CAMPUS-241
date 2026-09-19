import type { Metadata } from "next";
import Link from "next/link";
import { Heart } from "lucide-react";

import { Button } from "@campus241/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@campus241/shared/ui/card";
import { ESTABLISHMENT_LEVEL_LABELS, PUBLIC_PRIVATE_LABELS } from "@campus241/shared/establishment";
import { toggleFavorite } from "@/lib/actions/favorites";
import { prisma } from "@campus241/shared/prisma";
import { requireUser } from "@campus241/shared/session";

export const metadata: Metadata = { title: "Mes favoris" };

export default async function FavorisPage() {
  const user = await requireUser();

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    include: { establishment: true },
    orderBy: { createdAt: "desc" },
  });

  if (favorites.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-black/10 p-12 text-center text-neutral-500">
        Vous n&apos;avez pas encore d&apos;établissement favori.
        <div className="mt-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/annuaire">Parcourir l&apos;annuaire</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {favorites.map(({ establishment }) => (
        <Card key={establishment.id}>
          <CardHeader>
            <CardTitle>
              <Link href={`/annuaire/${establishment.id}`} className="hover:text-brand-blue">
                {establishment.name}
              </Link>
            </CardTitle>
            <CardDescription>
              {PUBLIC_PRIVATE_LABELS[establishment.publicOrPrivate]}
              {establishment.levels.length > 0
                ? ` · ${establishment.levels.map((level) => ESTABLISHMENT_LEVEL_LABELS[level]).join(", ")}`
                : ""}
              {establishment.city ? ` · ${establishment.city}` : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={toggleFavorite.bind(null, establishment.id)}>
              <Button type="submit" variant="outline" size="sm">
                <Heart className="size-4 fill-current" />
                Retirer des favoris
              </Button>
            </form>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
