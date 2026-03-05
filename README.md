# Tax Calcul — Simulateur fiscal Auto-Entrepreneur 2026

Application web de simulation fiscale pour auto-entrepreneurs français, basée sur les taux URSSAF 2026.

## Fonctionnalités

### Onglet "Calcul des taxes"
- Saisie du chiffre d'affaires (CA) et de la période de déclaration (mensuelle, trimestrielle, annuelle)
- Sélection du type d'activité parmi 6 régimes :
  - Vente de marchandises / achat-revente (BIC) — plafond 203 100 €
  - Prestations de services commerciales/artisanales (BIC) — plafond 83 600 €
  - Professions libérales non réglementées (BNC régime général) — plafond 83 600 €
  - Professions libérales non réglementées (BNC Sécurité Sociale) — plafond 83 600 €
  - Professions libérales réglementées CIPAV — plafond 83 600 €
  - Location meublée de tourisme classée (LMTC) — plafond 203 100 €
- Options :
  - **Versement libératoire** de l'IR (taux fixe sur le CA)
  - **ACRE** (réduction 50 % des cotisations la première année)
  - Nombre de parts du quotient familial
  - Autres revenus du foyer fiscal
- Résultats calculés en temps réel :
  - Cotisations sociales URSSAF
  - Revenu imposable (après abattement forfaitaire)
  - Estimation de l'impôt sur le revenu (barème IR 2026)
  - Tranche marginale d'imposition
  - Statut TVA (franchise en base ou redevable)
  - Alertes de dépassement de plafond CA et de seuil TVA
  - Revenu net estimé et total des charges

### Onglet "Achats professionnels"
- Ajout d'achats avec description, montant TTC, taux de TVA (0 %, 5,5 %, 10 %, 20 %) et catégorie
- Catégories : matériel informatique, fournitures de bureau, frais de déplacement, formation, logiciels & abonnements, services externes, autres
- Calcul automatique de la TVA déductible par achat
- Liste des achats avec total de TVA récupérable

### Onglet "Guide & Taux"
- Récapitulatif des taux de cotisations et d'abattement par type d'activité
- Barème des tranches IR 2026
- Informations sur les seuils de franchise TVA

## Stack technique

| Outil | Version |
|---|---|
| React | 19 |
| TypeScript | 5.9 |
| Vite | 7 |
| Tailwind CSS | 4 |
| Radix UI | 1 |
| shadcn/ui | 3 |
| lucide-react | 0.577 |
| uuid | 13 |

## Prérequis

- **Node.js** >= 18
- **npm** (ou pnpm / yarn)

## Installation et lancement

```bash
# 1. Cloner le projet
git clone <url-du-repo>
cd tax-calcul

# 2. Installer les dépendances
npm install

# 3. Lancer en mode développement
npm run dev
```

L'application est accessible sur `http://localhost:5173`

## Autres commandes

```bash
# Compiler pour la production
npm run build

# Prévisualiser le build de production
npm run preview

# Linter
npm run lint
```

## Structure du projet

```
src/
├── App.tsx                        # Composant racine, navigation par onglets
├── main.tsx                       # Point d'entrée
├── index.css                      # Styles globaux Tailwind
├── types/
│   └── tax.types.ts               # Types TypeScript (ActivityType, Purchase, TaxFormState...)
├── lib/
│   ├── tax-constants.ts           # Taux URSSAF 2026, tranches IR, seuils TVA
│   ├── tax-calculator.ts          # Logique de calcul fiscal
│   └── utils.ts                   # Utilitaire cn() pour les classes CSS
├── hooks/
│   └── useTaxCalculator.ts        # Hook principal (état du formulaire, achats, résultats)
└── components/
    ├── layout/
    │   └── Header.tsx
    ├── features/
    │   ├── TaxForm.tsx            # Formulaire de saisie du CA et des options
    │   ├── TaxResults.tsx         # Affichage des résultats fiscaux
    │   ├── PurchaseForm.tsx       # Formulaire d'ajout d'achat
    │   ├── PurchaseList.tsx       # Liste des achats et TVA déductible
    │   ├── InfoPanel.tsx          # Guide et taux de référence
    │   └── EmptyResults.tsx       # État vide (aucun résultat)
    └── ui/                        # Composants shadcn/ui (Button, Card, Input...)
```

## Avertissement

Les calculs sont basés sur les taux URSSAF 2026 et le barème IR 2026. Cet outil est indicatif et ne remplace pas les conseils d'un expert-comptable pour votre situation personnelle.
