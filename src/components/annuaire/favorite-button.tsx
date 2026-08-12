import Link from "next/link";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toggleFavorite } from "@/lib/actions/favorites";

export function FavoriteButton({
  establishmentId,
  isFavorited,
  isLoggedIn,
}: {
  establishmentId: string;
  isFavorited: boolean;
  isLoggedIn: boolean;
}) {
  if (!isLoggedIn) {
    return (
      <Button asChild variant="outline" size="sm">
        <Link href="/connexion">
          <Heart className="size-4" />
          Se connecter pour ajouter aux favoris
        </Link>
      </Button>
    );
  }

  return (
    <form action={toggleFavorite.bind(null, establishmentId)}>
      <Button type="submit" variant={isFavorited ? "secondary" : "outline"} size="sm">
        <Heart className={isFavorited ? "size-4 fill-current" : "size-4"} />
        {isFavorited ? "Dans vos favoris" : "Ajouter aux favoris"}
      </Button>
    </form>
  );
}
