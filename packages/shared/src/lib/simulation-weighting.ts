import type { QuestionFrequencyTier } from "@prisma/client";

export type WeightedQuestion = { id: string; frequencyTier: QuestionFrequencyTier | null };

export type FrequencyWeights = {
  TRES_FREQUENTE: number;
  FREQUENTE: number;
  OCCASIONNELLE: number;
  RARE: number;
};

function shuffle<T>(items: T[]): T[] {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Sélectionne `count` questions parmi `eligible` en respectant autant que possible
 * la pondération par palier de fréquence. Redistribue gracieusement le quota des
 * paliers vides (jamais de simulation composée uniquement des notions populaires,
 * jamais d'échec faute de données).
 */
export function pickWeightedQuestions<T extends WeightedQuestion>(
  eligible: T[],
  weights: FrequencyWeights,
  count: number,
): T[] {
  const tiers: QuestionFrequencyTier[] = ["TRES_FREQUENTE", "FREQUENTE", "OCCASIONNELLE", "RARE"];
  const buckets = new Map<QuestionFrequencyTier, T[]>(tiers.map((t) => [t, []]));
  const unclassified: T[] = [];

  for (const question of eligible) {
    if (question.frequencyTier && buckets.has(question.frequencyTier)) {
      buckets.get(question.frequencyTier)!.push(question);
    } else {
      unclassified.push(question);
    }
  }

  const availableTiers = tiers.filter((t) => (buckets.get(t)?.length ?? 0) > 0);
  const totalWeight = availableTiers.reduce((sum, t) => sum + Math.max(0, weights[t]), 0);

  const selected: T[] = [];
  const selectedIds = new Set<string>();

  if (totalWeight > 0) {
    for (const tier of availableTiers) {
      const bucket = shuffle(buckets.get(tier)!);
      const target = Math.round((count * Math.max(0, weights[tier])) / totalWeight);
      for (const question of bucket.slice(0, target)) {
        selected.push(question);
        selectedIds.add(question.id);
      }
    }
  }

  if (selected.length < count) {
    const remainder = shuffle(eligible.filter((q) => !selectedIds.has(q.id)));
    for (const question of remainder) {
      if (selected.length >= count) break;
      selected.push(question);
      selectedIds.add(question.id);
    }
  }

  return shuffle(selected).slice(0, count);
}
