import { Card, CardContent } from "@/components/ui/card";

export function PlaceholderPage({
  title,
  description,
  sprint,
}: {
  title: string;
  description: string;
  sprint: string;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
      <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
        {title}
      </h1>
      <p className="mt-4 text-lg text-neutral-600">{description}</p>
      <Card className="mt-8 inline-block">
        <CardContent className="pt-5">
          <p className="text-sm font-medium text-brand-blue">
            Disponible {sprint}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
