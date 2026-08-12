import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ClipboardList, GraduationCap, Timer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "CAMPUS BAC" };

const steps = [
  {
    icon: ClipboardList,
    title: "Choisissez votre sélection",
    description: "Série, matière, chapitres (en entraînement) et nombre de questions.",
  },
  {
    icon: Timer,
    title: "Passez la simulation",
    description: "Mode entraînement libre ou mode examen chronométré, proche des conditions réelles.",
  },
  {
    icon: CheckCircle2,
    title: "Analysez vos résultats",
    description: "Score, temps utilisé, et répartition par chapitre pour cibler vos révisions.",
  },
];

export default async function BacPage() {
  const [seriesCount, questionsCount] = await Promise.all([
    prisma.series.count({ where: { isActive: true } }),
    prisma.question.count({ where: { published: true } }),
  ]);

  return (
    <div>
      <section className="bg-gradient-to-b from-brand-blue-light to-white">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-brand-blue-light text-brand-blue">
            <GraduationCap className="size-7" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl">
            CAMPUS BAC
          </h1>
          <p className="max-w-2xl text-lg text-neutral-600">
            Simulez des épreuves du Baccalauréat, identifiez vos lacunes et suivez votre
            progression chapitre par chapitre. {seriesCount} série(s) et {questionsCount}{" "}
            question(s) disponibles.
          </p>
          <Button asChild size="lg">
            <Link href="/bac/nouvelle-simulation">Démarrer une simulation</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {steps.map((step) => (
            <Card key={step.title}>
              <CardHeader>
                <div className="flex size-11 items-center justify-center rounded-xl bg-brand-blue-light text-brand-blue">
                  <step.icon className="size-5" />
                </div>
                <CardTitle className="mt-2">{step.title}</CardTitle>
                <CardDescription>{step.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
