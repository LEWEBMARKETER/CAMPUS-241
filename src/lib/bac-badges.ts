import { prisma } from "@/lib/prisma";

export async function checkAndAwardBadges(userId: string) {
  const [simulations, badges, earnedBadges] = await Promise.all([
    prisma.simulation.findMany({
      where: { userId, status: "TERMINEE" },
      select: { score: true, correctCount: true, incorrectCount: true },
    }),
    prisma.badge.findMany(),
    prisma.userBadge.findMany({ where: { userId }, select: { badgeId: true } }),
  ]);

  const earnedBadgeIds = new Set(earnedBadges.map((b) => b.badgeId));
  const simulationsCount = simulations.length;
  const questionsAnswered = simulations.reduce(
    (sum, s) => sum + (s.correctCount ?? 0) + (s.incorrectCount ?? 0),
    0,
  );
  const averageScore =
    simulationsCount > 0
      ? simulations.reduce((sum, s) => sum + (s.score ?? 0), 0) / simulationsCount
      : 0;

  const toAward: string[] = [];

  for (const badge of badges) {
    if (earnedBadgeIds.has(badge.id)) continue;

    const qualifies = (() => {
      switch (badge.criteriaType) {
        case "FIRST_SIMULATION":
          return simulationsCount >= 1;
        case "SIMULATIONS_COUNT":
          return simulationsCount >= (badge.threshold ?? Infinity);
        case "QUESTIONS_ANSWERED":
          return questionsAnswered >= (badge.threshold ?? Infinity);
        case "AVERAGE_SCORE":
          return simulationsCount > 0 && averageScore >= (badge.threshold ?? Infinity);
        default:
          return false;
      }
    })();

    if (qualifies) toAward.push(badge.id);
  }

  if (toAward.length > 0) {
    await prisma.userBadge.createMany({
      data: toAward.map((badgeId) => ({ userId, badgeId })),
      skipDuplicates: true,
    });
  }

  return toAward;
}
