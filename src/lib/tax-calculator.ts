import type {
  ActivityType,
  Purchase,
  TaxCalculationResult,
  TrancheFiscale,
  TvaRate,
} from "@/types/tax.types";
import {
  ACTIVITY_CONFIGS,
  ACRE_REDUCTION,
  TRANCHES_IR,
} from "./tax-constants";

/**
 * Calcule la TVA déductible sur un montant TTC
 */
export function calcTvaDeductible(amountTTC: number, tvaRate: TvaRate): number {
  if (tvaRate === 0) return 0;
  const coeff = tvaRate / 100;
  return (amountTTC * coeff) / (1 + coeff);
}

/**
 * Calcule l'impôt sur le revenu selon le barème progressif
 */
export function calcImpotProgressif(
  revenuImposable: number,
  nbParts: number
): { impot: number; tranche: TrancheFiscale | null } {
  const quotient = revenuImposable / nbParts;
  let impotSurQuotient = 0;
  let trancheActive: TrancheFiscale | null = null;

  for (let i = 0; i < TRANCHES_IR.length; i++) {
    const tranche = TRANCHES_IR[i];
    const max = tranche.max ?? Infinity;

    if (quotient <= tranche.min) break;

    const baseImposable = Math.min(quotient, max) - tranche.min;
    impotSurQuotient += baseImposable * tranche.taux;

    if (quotient > tranche.min) {
      trancheActive = tranche;
    }
  }

  return {
    impot: Math.round(impotSurQuotient * nbParts),
    tranche: trancheActive,
  };
}

export interface CalcTaxParams {
  chiffreAffaires: number;
  activityType: ActivityType;
  declarationPeriod: "mensuelle" | "trimestrielle" | "annuelle";
  optVersementLiberatoire: boolean;
  optACRE: boolean;
  nbPartsQuotientFamilial: number;
  autresRevenus: number;
  purchases: Purchase[];
}

/**
 * Calcul complet des taxes auto-entrepreneur 2026
 */
export function calculateTaxes(params: CalcTaxParams): TaxCalculationResult {
  const {
    chiffreAffaires,
    activityType,
    declarationPeriod,
    optVersementLiberatoire,
    optACRE,
    nbPartsQuotientFamilial,
    autresRevenus,
    purchases,
  } = params;

  const config = ACTIVITY_CONFIGS[activityType];

  // --- Cotisations sociales ---
  let cotisationRate = config.cotisationRate;
  if (optACRE) {
    cotisationRate = cotisationRate * (1 - ACRE_REDUCTION);
  }
  const cotisationsSociales = chiffreAffaires * cotisationRate;

  // --- Revenu imposable après abattement forfaitaire ---
  const abattement = chiffreAffaires * config.abattementRate;
  const abattementMinimum = 305;
  const abattementEffectif = Math.max(abattement, abattementMinimum);
  const revenuImposable = Math.max(0, chiffreAffaires - abattementEffectif);

  // --- Impôt sur le revenu ---
  let impotEstime = 0;
  let impotVersementLiberatoire = 0;
  let tranche: TrancheFiscale | null = null;

  if (optVersementLiberatoire) {
    // Versement libératoire : taux fixe sur CA
    impotVersementLiberatoire = chiffreAffaires * config.versementLiberatoireRate;
    impotEstime = 0;
    tranche = null;
  } else {
    // Barème progressif : revenu imposable AE + autres revenus du foyer
    const revenuFiscalTotal = revenuImposable + autresRevenus;
    const result = calcImpotProgressif(revenuFiscalTotal, nbPartsQuotientFamilial);
    // On ne prend que la part attribuable à l'activité AE
    const tauxMoyen =
      revenuFiscalTotal > 0 ? result.impot / revenuFiscalTotal : 0;
    impotEstime = Math.round(revenuImposable * tauxMoyen);
    tranche = result.tranche;
  }

  // --- TVA déductible (si redevable TVA) ---
  const tvaDeductibleTotal = purchases.reduce((sum, p) => {
    return sum + calcTvaDeductible(p.amountTTC, p.tvaRate);
  }, 0);

  // --- Statut TVA ---
  const tvaStatus: "franchise" | "redevable" =
    chiffreAffaires <= config.tvaThreshold ? "franchise" : "redevable";

  // --- Alertes ---
  const alerteDepassementCA = chiffreAffaires > config.plafondCA;
  const alerteDepassementTVA = chiffreAffaires > config.tvaThreshold;

  // --- Total charges ---
  const impotTotal = optVersementLiberatoire ? impotVersementLiberatoire : impotEstime;
  const totalCharges = cotisationsSociales + impotTotal;

  // --- Revenu net estimé ---
  const revenuNet = chiffreAffaires - totalCharges;

  // --- Échéance selon la période de déclaration ---
  const echeanceDiviseur =
    declarationPeriod === "mensuelle" ? 12 : declarationPeriod === "trimestrielle" ? 4 : 1;
  const echeanceLabel =
    declarationPeriod === "mensuelle"
      ? "par mois"
      : declarationPeriod === "trimestrielle"
        ? "par trimestre"
        : "par an";
  const echeance = totalCharges / echeanceDiviseur;

  return {
    chiffreAffaires,
    cotisationsSociales: Math.round(cotisationsSociales),
    cotisationsSocialesRate: cotisationRate,
    revenuImposable: Math.round(revenuImposable),
    impotEstime: Math.round(impotEstime),
    impotVersementLiberatoire: Math.round(impotVersementLiberatoire),
    totalCharges: Math.round(totalCharges),
    revenuNet: Math.round(revenuNet),
    tvaDeductibleTotal: Math.round(tvaDeductibleTotal * 100) / 100,
    tvaStatus,
    alerteDepassementCA,
    alerteDepassementTVA,
    echeance: Math.round(echeance),
    echeanceLabel,
    tranche,
  };
}

/**
 * Formate un nombre en euros
 */
export function formatEuros(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formate un pourcentage
 */
export function formatPercent(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`;
}
