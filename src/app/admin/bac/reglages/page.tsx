import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getQuestionBankSettings, updateQuestionBankSettings } from "@/lib/actions/admin-bac-settings";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Réglages CAMPUS BAC" };

const inputClass =
  "w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-blue";
const labelClass = "mb-1 block text-sm font-medium text-neutral-700";

export default async function BacSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin();
  const { error } = await searchParams;
  const settings = await getQuestionBankSettings();

  return (
    <div className="flex flex-col gap-6">
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      <form action={updateQuestionBankSettings} className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pondération de génération des simulations</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-neutral-500">
              Répartition cible (%) des questions tirées par palier de fréquence dans les
              annales. La somme n&apos;est pas forcée à 100 : elle sert de poids relatif.
            </p>
            <div className="grid gap-4 sm:grid-cols-4">
              <div>
                <label className={labelClass}>Très fréquentes</label>
                <input
                  type="number"
                  name="weightTresFrequente"
                  step="1"
                  defaultValue={settings.weightTresFrequente}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Fréquentes</label>
                <input
                  type="number"
                  name="weightFrequente"
                  step="1"
                  defaultValue={settings.weightFrequente}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Occasionnelles</label>
                <input
                  type="number"
                  name="weightOccasionnelle"
                  step="1"
                  defaultValue={settings.weightOccasionnelle}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Rares</label>
                <input
                  type="number"
                  name="weightRare"
                  step="1"
                  defaultValue={settings.weightRare}
                  className={inputClass}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seuils de niveau de maîtrise</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-neutral-500">
              Bornes (%) entre les 6 paliers : À renforcer / Fragile / En progression / Bon
              niveau / Très bon niveau / Maîtrise. Doivent être strictement croissantes.
            </p>
            <div className="grid gap-4 sm:grid-cols-5">
              <div>
                <label className={labelClass}>Fragile ≥</label>
                <input
                  type="number"
                  name="masteryThreshold1"
                  defaultValue={settings.masteryThreshold1}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>En progression ≥</label>
                <input
                  type="number"
                  name="masteryThreshold2"
                  defaultValue={settings.masteryThreshold2}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Bon niveau ≥</label>
                <input
                  type="number"
                  name="masteryThreshold3"
                  defaultValue={settings.masteryThreshold3}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Très bon niveau ≥</label>
                <input
                  type="number"
                  name="masteryThreshold4"
                  defaultValue={settings.masteryThreshold4}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Maîtrise ≥</label>
                <input
                  type="number"
                  name="masteryThreshold5"
                  defaultValue={settings.masteryThreshold5}
                  className={inputClass}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-fit">
          Enregistrer les réglages
        </Button>
      </form>
    </div>
  );
}
