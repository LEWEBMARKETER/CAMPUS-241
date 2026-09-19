import { prisma } from "./prisma";

export async function getQuestionBankSettings() {
  return prisma.questionBankSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });
}
