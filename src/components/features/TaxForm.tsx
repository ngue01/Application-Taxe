import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TaxFormState, ActivityType, DeclarationPeriod } from "@/types/tax.types";
import { ACTIVITY_CONFIGS } from "@/lib/tax-constants";
import { formatEuros } from "@/lib/tax-calculator";

interface TaxFormProps {
  formState: TaxFormState;
  onChange: <K extends keyof TaxFormState>(key: K, value: TaxFormState[K]) => void;
}

export function TaxForm({ formState, onChange }: TaxFormProps) {
  const config = ACTIVITY_CONFIGS[formState.activityType];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <span className="text-blue-600">&#9998;</span>
          Votre situation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">

        {/* Activité */}
        <div className="space-y-1.5">
          <Label htmlFor="activity">Type d'activité</Label>
          <Select
            value={formState.activityType}
            onValueChange={(v) => onChange("activityType", v as ActivityType)}
          >
            <SelectTrigger id="activity">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(ACTIVITY_CONFIGS).map(([key, cfg]) => (
                <SelectItem key={key} value={key}>
                  {cfg.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">{config.description}</p>
        </div>

        {/* Chiffre d'affaires */}
        <div className="space-y-1.5">
          <Label htmlFor="ca">Chiffre d'affaires annuel (€)</Label>
          <div className="relative">
            <Input
              id="ca"
              type="number"
              min={0}
              step={100}
              placeholder="Ex : 45 000"
              value={formState.chiffreAffaires}
              onChange={(e) => onChange("chiffreAffaires", e.target.value)}
              className="pr-8"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              €
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Plafond autorisé :{" "}
            <strong>{formatEuros(config.plafondCA)}</strong>
          </p>
        </div>

        {/* Période de déclaration */}
        <div className="space-y-1.5">
          <Label htmlFor="period">Période de déclaration</Label>
          <Select
            value={formState.declarationPeriod}
            onValueChange={(v) => onChange("declarationPeriod", v as DeclarationPeriod)}
          >
            <SelectTrigger id="period">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mensuelle">Mensuelle</SelectItem>
              <SelectItem value="trimestrielle">Trimestrielle</SelectItem>
              <SelectItem value="annuelle">Annuelle</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Options fiscales */}
        <div className="space-y-3 pt-1">
          <p className="text-sm font-medium">Options fiscales</p>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={formState.optVersementLiberatoire}
              onChange={(e) => onChange("optVersementLiberatoire", e.target.checked)}
              className="w-4 h-4 accent-blue-600 cursor-pointer"
            />
            <div>
              <span className="text-sm font-medium group-hover:text-blue-600 transition-colors">
                Versement libératoire de l'IR
              </span>
              <p className="text-xs text-muted-foreground">
                Taux fixe de {(config.versementLiberatoireRate * 100).toFixed(1)}% sur le CA
              </p>
            </div>
            <Badge variant="outline" className="ml-auto text-xs">
              {(config.versementLiberatoireRate * 100).toFixed(1)}%
            </Badge>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={formState.optACRE}
              onChange={(e) => onChange("optACRE", e.target.checked)}
              className="w-4 h-4 accent-blue-600 cursor-pointer"
            />
            <div>
              <span className="text-sm font-medium group-hover:text-blue-600 transition-colors">
                Bénéficiaire de l'ACRE
              </span>
              <p className="text-xs text-muted-foreground">
                Réduction de 50% des cotisations (1ère année)
              </p>
            </div>
            <Badge variant="outline" className="ml-auto text-xs text-green-600">
              -50%
            </Badge>
          </label>
        </div>

        {/* Foyer fiscal */}
        <div className="space-y-3 pt-1 border-t">
          <p className="text-sm font-medium pt-2">Foyer fiscal (pour le barème IR)</p>

          <div className="space-y-1.5">
            <Label htmlFor="parts">Nombre de parts fiscales</Label>
            <Select
              value={String(formState.nbPartsQuotientFamilial)}
              onValueChange={(v) => onChange("nbPartsQuotientFamilial", Number(v))}
            >
              <SelectTrigger id="parts">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 1.5, 2, 2.5, 3, 3.5, 4, 5].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n} part{n > 1 ? "s" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="autresRevenus">Autres revenus du foyer (€/an)</Label>
            <div className="relative">
              <Input
                id="autresRevenus"
                type="number"
                min={0}
                placeholder="0"
                value={formState.autresRevenus}
                onChange={(e) => onChange("autresRevenus", e.target.value)}
                className="pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                €
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Salaires, autres activités... (influence le calcul de l'IR barème)
            </p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
