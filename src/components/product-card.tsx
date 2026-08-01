import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export type ProductCardProps = {
  title: string;
  description: string;
  priceLabel: string;
};

export function ProductCard({ title, description, priceLabel }: ProductCardProps) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex size-11 items-center justify-center rounded-xl bg-brand-green-light text-brand-green-dark">
          <ShoppingBag className="size-5" />
        </div>
        <CardTitle className="mt-2">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto flex items-center justify-between">
        <span className="text-sm font-semibold text-neutral-900">
          {priceLabel}
        </span>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" size="sm" className="w-full" disabled>
          Bientôt disponible
        </Button>
      </CardFooter>
    </Card>
  );
}
