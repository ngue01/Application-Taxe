export type ActivityType =
  | "vente_marchandises"
  | "prestations_services_bnc"
  | "prestations_services_bic"
  | "liberal_non_reglemente"
  | "liberal_cipav"
  | "location_meublee_classee";

export type DeclarationPeriod = "mensuelle" | "trimestrielle" | "annuelle";

export interface ActivityConfig {
  label: string;
  cotisationRate: number;       // taux cotisations sociales
  abattementRate: number;       // taux abattement forfaitaire IR
  versementLiberatoireRate: number; // taux versement libératoire IR
  plafondCA: number;            // plafond annuel CA
  tvaThreshold: number;         // seuil franchise TVA
  tvaThresholdMajore: number;   // seuil majoré franchise TVA
  description: string;
}

export interface Purchase {
  id: string;
  description: string;
  amountTTC: number;
  tvaRate: TvaRate;
  date: string;
  category: PurchaseCategory;
}

export type TvaRate = 0 | 5.5 | 10 | 20;

export type PurchaseCategory =
  | "materiel_informatique"
  | "fournitures_bureau"
  | "frais_deplacement"
  | "formation"
  | "logiciels_abonnements"
  | "services_externaux"
  | "autres";

export interface TaxCalculationResult {
  chiffreAffaires: number;
  cotisationsSociales: number;
  cotisationsSocialesRate: number;
  revenuImposable: number;
  impotEstime: number;
  impotVersementLiberatoire: number;
  totalCharges: number;
  revenuNet: number;
  tvaDeductibleTotal: number;
  tvaStatus: "franchise" | "redevable";
  alerteDepassementCA: boolean;
  alerteDepassementTVA: boolean;
  echeance: number;
  echeanceLabel: string;
  tranche: TrancheFiscale | null;
}

export interface TrancheFiscale {
  taux: number;
  min: number;
  max: number | null;
  label: string;
}

export interface TaxFormState {
  chiffreAffaires: string;
  activityType: ActivityType;
  declarationPeriod: DeclarationPeriod;
  optVersementLiberatoire: boolean;
  optACRE: boolean;
  nbPartsQuotientFamilial: number;
  autresRevenus: string;
}
