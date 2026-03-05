import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TvaRate, PurchaseCategory } from "@/types/tax.types";
import { PURCHASE_CATEGORY_LIST, TVA_RATES } from "@/lib/tax-constants";
import { calcTvaDeductible } from "@/lib/tax-calculator";

interface PurchaseFormProps {
  onAdd: (data: {
    description: string;
    amountTTC: number;
    tvaRate: TvaRate;
    date: string;
    category: PurchaseCategory;
  }) => void;
}

const EMPTY_STATE = {
  description: "",
  amountTTC: "",
  tvaRate: "20" as string,
  date: new Date().toISOString().split("T")[0],
  category: "autres" as PurchaseCategory,
};

export function PurchaseForm({ onAdd }: PurchaseFormProps) {
  const [form, setForm] = useState(EMPTY_STATE);
  const [error, setError] = useState<string | null>(null);

  const tvaRate = Number(form.tvaRate) as TvaRate;
  const amountTTC = parseFloat(form.amountTTC) || 0;
  const tvaDeductible = calcTvaDeductible(amountTTC, tvaRate);
  const amountHT = amountTTC - tvaDeductible;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.description.trim()) {
      setError("La description est requise.");
      return;
    }
    if (amountTTC <= 0) {
      setError("Le montant TTC doit être supérieur à 0.");
      return;
    }

    onAdd({
      description: form.description.trim(),
      amountTTC,
      tvaRate,
      date: form.date,
      category: form.category,
    });

    setForm(EMPTY_STATE);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Ajouter un achat professionnel</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="p-desc">Description</Label>
              <Input
                id="p-desc"
                placeholder="Ex : Abonnement GitHub"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="p-amount">Montant TTC (€)</Label>
              <Input
                id="p-amount"
                type="number"
                min={0}
                step={0.01}
                placeholder="0.00"
                value={form.amountTTC}
                onChange={(e) => setForm((f) => ({ ...f, amountTTC: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="p-tva">Taux TVA</Label>
              <Select
                value={form.tvaRate}
                onValueChange={(v) => setForm((f) => ({ ...f, tvaRate: v }))}
              >
                <SelectTrigger id="p-tva">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TVA_RATES.map((r) => (
                    <SelectItem key={r} value={String(r)}>
                      {r}%
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="p-cat">Catégorie</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm((f) => ({ ...f, category: v as PurchaseCategory }))}
              >
                <SelectTrigger id="p-cat">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PURCHASE_CATEGORY_LIST.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="p-date">Date</Label>
              <Input
                id="p-date"
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              />
            </div>
          </div>

          {/* Aperçu TVA */}
          {amountTTC > 0 && tvaRate > 0 && (
            <div className="bg-blue-50 rounded-md p-2.5 text-xs text-blue-700 space-y-0.5">
              <div className="flex justify-between">
                <span>Montant HT :</span>
                <strong>{amountHT.toFixed(2)} €</strong>
              </div>
              <div className="flex justify-between">
                <span>TVA déductible ({tvaRate}%) :</span>
                <strong className="text-green-700">{tvaDeductible.toFixed(2)} €</strong>
              </div>
            </div>
          )}

          {error && <p className="text-xs text-red-600">{error}</p>}

          <Button type="submit" className="w-full" size="sm">
            + Ajouter cet achat
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
