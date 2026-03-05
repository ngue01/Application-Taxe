import type { ActivityConfig, ActivityType, TrancheFiscale, PurchaseCategory } from "@/types/tax.types";

// Taux 2026 - Source : URSSAF / legisocial.fr
export const ACTIVITY_CONFIGS: Record<ActivityType, ActivityConfig> = {
  vente_marchandises: {
    label: "Vente de marchandises / achat-revente (BIC)",
    cotisationRate: 0.123,
    abattementRate: 0.71,
    versementLiberatoireRate: 0.01,
    plafondCA: 203100,
    tvaThreshold: 85000,
    tvaThresholdMajore: 93500,
    description: "Commerce, achat-revente de biens, restauration à emporter",
  },
  prestations_services_bic: {
    label: "Prestations de services commerciales / artisanales (BIC)",
    cotisationRate: 0.212,
    abattementRate: 0.5,
    versementLiberatoireRate: 0.017,
    plafondCA: 83600,
    tvaThreshold: 37500,
    tvaThresholdMajore: 41250,
    description: "Artisans, prestataires de services commerciaux (BIC)",
  },
  prestations_services_bnc: {
    label: "Professions libérales non réglementées (BNC – régime général)",
    cotisationRate: 0.256,
    abattementRate: 0.34,
    versementLiberatoireRate: 0.022,
    plafondCA: 83600,
    tvaThreshold: 37500,
    tvaThresholdMajore: 41250,
    description: "Consultants, freelances, développeurs, formateurs...",
  },
  liberal_non_reglemente: {
    label: "Professions libérales non réglementées (BNC – Sécurité Sociale)",
    cotisationRate: 0.256,
    abattementRate: 0.34,
    versementLiberatoireRate: 0.022,
    plafondCA: 83600,
    tvaThreshold: 37500,
    tvaThresholdMajore: 41250,
    description: "Professions libérales rattachées au régime général SS",
  },
  liberal_cipav: {
    label: "Professions libérales réglementées (CIPAV)",
    cotisationRate: 0.232,
    abattementRate: 0.34,
    versementLiberatoireRate: 0.022,
    plafondCA: 83600,
    tvaThreshold: 37500,
    tvaThresholdMajore: 41250,
    description: "Architectes, ingénieurs, géomètres, experts...",
  },
  location_meublee_classee: {
    label: "Location meublée de tourisme classée (LMTC)",
    cotisationRate: 0.06,
    abattementRate: 0.71,
    versementLiberatoireRate: 0.01,
    plafondCA: 203100,
    tvaThreshold: 85000,
    tvaThresholdMajore: 93500,
    description: "Location saisonnière classée (gîtes, chambres d'hôtes...)",
  },
};

// Taux ACRE 2026 (réduction 50% la première année)
export const ACRE_REDUCTION = 0.5;

// Tranches IR 2026 (revenus 2025, barème 2026)
export const TRANCHES_IR: TrancheFiscale[] = [
  { taux: 0, min: 0, max: 11294, label: "0%" },
  { taux: 0.11, min: 11294, max: 28797, label: "11%" },
  { taux: 0.30, min: 28797, max: 82341, label: "30%" },
  { taux: 0.41, min: 82341, max: 177106, label: "41%" },
  { taux: 0.45, min: 177106, max: null, label: "45%" },
];

export const TVA_RATES = [0, 5.5, 10, 20] as const;

export const PURCHASE_CATEGORIES: Record<string, string> = {
  materiel_informatique: "Matériel informatique",
  fournitures_bureau: "Fournitures de bureau",
  frais_deplacement: "Frais de déplacement",
  formation: "Formation professionnelle",
  logiciels_abonnements: "Logiciels & Abonnements",
  services_externaux: "Services externes",
  autres: "Autres",
};

export const PURCHASE_CATEGORY_LIST = Object.entries(PURCHASE_CATEGORIES).map(
  ([value, label]) => ({ value: value as PurchaseCategory, label })
);

// Seuil versement libératoire 2026 (RFR 2024 ne doit pas dépasser)
export const SEUIL_VERSEMENT_LIBERATOIRE_PAR_PART = 28797;
