import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { SimulationPlayer } from "@/components/bac/simulation-player";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Simulation en cours" };

export default async function PasserSimulationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();

  const simulation = await prisma.simulation.findUnique({
    where: { id },
    include: {
      answers: {
        include: { question: { include: { choices: { orderBy: { order: "asc" } } } } },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!simulation || simulation.userId !== user.id) {
    redirect("/dashboard/bac");
  }
  if (simulation.status !== "EN_COURS") {
    redirect(`/bac/simulations/${id}/resultats`);
  }

  const questions = simulation.answers.map((a) => ({
    answerId: a.id,
    questionId: a.questionId,
    prompt: a.question.prompt,
    type: a.question.type,
    choices: a.question.choices.map((c) => ({ id: c.id, label: c.label })),
  }));

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <SimulationPlayer
        simulationId={simulation.id}
        questions={questions}
        durationSeconds={simulation.durationSeconds}
      />
    </div>
  );
}
