import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import type { TaxCalculationResult } from "@/types/tax.types";
import { formatEuros, formatPercent } from "@/lib/tax-calculator";
import { ACTIVITY_CONFIGS } from "@/lib/tax-constants";
import type { ActivityType } from "@/types/tax.types";

interface TaxResultsProps {
  result: TaxCalculationResult;
  activityType: ActivityType;
  optVersementLiberatoire: boolean;
}

export function TaxResults({ result, activityType, optVersementLiberatoire }: TaxResultsProps) {
  const config = ACTIVITY_CONFIGS[activityType];
  const caProgressPct = Math.min((result.chiffreAffaires / config.plafondCA) * 100, 100);
  const tvaProgressPct = Math.min((result.chiffreAffaires / config.tvaThreshold) * 100, 100);

  const impotAffiche = optVersementLiberatoire
    ? result.impotVersementLiberatoire
    : result.impotEstime;

  return (
    <div className="space-y-4">

      {/* Alertes */}
      {result.alerteDepassementCA && (
        <Alert variant="destructive">
          <AlertDescription>
            <strong>Attention !</strong> Votre CA ({formatEuros(result.chiffreAffaires)}) dépasse le
            plafond autorisé de {formatEuros(config.plafondCA)}. Vous perdrez le régime
            micro-entrepreneur.
          </AlertDescription>
        </Alert>
      )}

      {result.alerteDepassementTVA && !result.alerteDepassementCA && (
        <Alert>
          <AlertDescription>
            <strong>TVA :</strong> Votre CA dépasse {formatEuros(config.tvaThreshold)}. Vous êtes
            redevable de la TVA et devez facturer 20% à vos clients.
          </AlertDescription>
        </Alert>
      )}

      {/* Synthèse principale */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <span className="text-green-600">&#9711;</span>
            Synthèse annuelle
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">

          {/* Revenu net en évidence */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 text-center border border-blue-100">
            <p className="text-sm text-blue-700 font-medium mb-1">Revenu net estimé</p>
            <p className="text-3xl font-bold text-blue-800">{formatEuros(result.revenuNet)}</p>
            <p className="text-xs text-blue-600 mt-1">
              soit {formatEuros(Math.round(result.revenuNet / 12))} / mois
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              label="Chiffre d'affaires"
              value={formatEuros(result.chiffreAffaires)}
              variant="neutral"
            />
            <MetricCard
              label="Total charges"
              value={formatEuros(result.totalCharges)}
              sub={formatPercent(result.totalCharges / result.chiffreAffaires) + " du CA"}
              variant="danger"
            />
          </div>

          <Separator />

          <div className="space-y-2.5">
            <LineItem
              label="Cotisations sociales URSSAF"
              value={formatEuros(result.cotisationsSociales)}
              sub={`Taux : ${formatPercent(result.cotisationsSocialesRate)}`}
              badge={<Badge variant="outline" className="text-xs">{formatPercent(result.cotisationsSocialesRate)}</Badge>}
            />
            <LineItem
              label={optVersementLiberatoire ? "IR – Versement libératoire" : "IR estimé (barème)"}
              value={formatEuros(impotAffiche)}
              sub={
                optVersementLiberatoire
                  ? `Taux fixe ${formatPercent(config.versementLiberatoireRate)} sur CA`
                  : result.tranche
                    ? `Tranche marginale : ${result.tranche.label}`
                    : "Revenu non imposable"
              }
              badge={
                optVersementLiberatoire
                  ? <Badge className="text-xs bg-purple-100 text-purple-700">Libératoire</Badge>
                  : <Badge variant="outline" className="text-xs">{result.tranche?.label ?? "0%"}</Badge>
              }
            />
            {!optVersementLiberatoire && (
              <LineItem
                label="Revenu imposable (après abattement)"
                value={formatEuros(result.revenuImposable)}
                sub={`Abattement forfaitaire : ${(config.abattementRate * 100).toFixed(0)}%`}
              />
            )}
          </div>

          <Separator />

          <div className="space-y-2">
            <LineItem
              label={`Échéance charges (${result.echeanceLabel})`}
              value={formatEuros(result.echeance)}
              sub={`Cotisations + IR — déclaration ${result.echeanceLabel}`}
            />
          </div>
        </CardContent>
      </Card>

      {/* Jauge CA & TVA */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Plafonds & TVA</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">

          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span>CA vs plafond micro-entreprise</span>
              <span className="font-medium">
                {formatEuros(result.chiffreAffaires)} / {formatEuros(config.plafondCA)}
              </span>
            </div>
            <Progress
              value={caProgressPct}
              className={caProgressPct >= 90 ? "[&>div]:bg-red-500" : "[&>div]:bg-blue-500"}
            />
            <p className="text-xs text-muted-foreground">{caProgressPct.toFixed(1)}% du plafond utilisé</p>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span>CA vs seuil franchise TVA</span>
              <span className="font-medium">
                {formatEuros(result.chiffreAffaires)} / {formatEuros(config.tvaThreshold)}
              </span>
            </div>
            <Progress
              value={tvaProgressPct}
              className={tvaProgressPct >= 100 ? "[&>div]:bg-red-500" : tvaProgressPct >= 80 ? "[&>div]:bg-orange-500" : "[&>div]:bg-green-500"}
            />
            <div className="flex items-center gap-2">
              <Badge
                className={
                  result.tvaStatus === "franchise"
                    ? "bg-green-100 text-green-700 text-xs"
                    : "bg-red-100 text-red-700 text-xs"
                }
              >
                {result.tvaStatus === "franchise" ? "Franchise TVA" : "Redevable TVA"}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {result.tvaStatus === "franchise"
                  ? "Vous ne facturez pas la TVA"
                  : "Vous devez facturer et reverser la TVA"}
              </span>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* Info TVA déductible */}
      {result.tvaDeductibleTotal > 0 && (
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">TVA déductible sur achats</p>
                <p className="text-xs text-green-600 mt-0.5">
                  Applicable si vous êtes redevable de la TVA
                </p>
              </div>
              <p className="text-xl font-bold text-green-700">
                {formatEuros(result.tvaDeductibleTotal)}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}

function MetricCard({
  label,
  value,
  sub,
  variant = "neutral",
}: {
  label: string;
  value: string;
  sub?: string;
  variant?: "neutral" | "danger" | "success";
}) {
  const colorClass =
    variant === "danger"
      ? "text-red-700"
      : variant === "success"
        ? "text-green-700"
        : "text-gray-900";

  return (
    <div className="rounded-lg border bg-gray-50 p-3 space-y-0.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-lg font-bold ${colorClass}`}>{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

function LineItem({
  label,
  value,
  sub,
  badge,
}: {
  label: string;
  value: string;
  sub?: string;
  badge?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm">{label}</span>
          {badge}
        </div>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
      <span className="text-sm font-semibold whitespace-nowrap">{value}</span>
    </div>
  );
}
