import { useState, useMemo, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import type { Purchase, TaxFormState, TvaRate, PurchaseCategory } from "@/types/tax.types";
import { calculateTaxes } from "@/lib/tax-calculator";

const DEFAULT_FORM_STATE: TaxFormState = {
  chiffreAffaires: "",
  activityType: "prestations_services_bnc",
  declarationPeriod: "trimestrielle",
  optVersementLiberatoire: false,
  optACRE: false,
  nbPartsQuotientFamilial: 1,
  autresRevenus: "",
};

export function useTaxCalculator() {
  const [formState, setFormState] = useState<TaxFormState>(DEFAULT_FORM_STATE);
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  const updateForm = useCallback(
    <K extends keyof TaxFormState>(key: K, value: TaxFormState[K]) => {
      setFormState((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const addPurchase = useCallback(
    (data: {
      description: string;
      amountTTC: number;
      tvaRate: TvaRate;
      date: string;
      category: PurchaseCategory;
    }) => {
      const purchase: Purchase = { ...data, id: uuidv4() };
      setPurchases((prev) => [purchase, ...prev]);
    },
    []
  );

  const removePurchase = useCallback((id: string) => {
    setPurchases((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const result = useMemo(() => {
    const ca = parseFloat(formState.chiffreAffaires);
    if (isNaN(ca) || ca <= 0) return null;

    return calculateTaxes({
      chiffreAffaires: ca,
      activityType: formState.activityType,
      declarationPeriod: formState.declarationPeriod,
      optVersementLiberatoire: formState.optVersementLiberatoire,
      optACRE: formState.optACRE,
      nbPartsQuotientFamilial: formState.nbPartsQuotientFamilial,
      autresRevenus: parseFloat(formState.autresRevenus) || 0,
      purchases,
    });
  }, [formState, purchases]);

  return {
    formState,
    updateForm,
    purchases,
    addPurchase,
    removePurchase,
    result,
  };
}
