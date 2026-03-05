import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ACTIVITY_CONFIGS, TRANCHES_IR } from "@/lib/tax-constants";
import { formatEuros } from "@/lib/tax-calculator";

export function InfoPanel() {
  return (
    <div className="space-y-4">

      {/* Taux cotisations 2026 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            Taux cotisations sociales 2026
            <Badge variant="secondary" className="text-xs">URSSAF</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.entries(ACTIVITY_CONFIGS).map(([, cfg]) => (
            <div key={cfg.label} className="flex items-center justify-between gap-2 text-xs py-1 border-b last:border-0">
              <span className="text-muted-foreground flex-1 min-w-0 truncate" title={cfg.label}>
                {cfg.label}
              </span>
              <Badge variant="outline" className="text-xs shrink-0">
                {(cfg.cotisationRate * 100).toFixed(1)}%
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Tranches IR */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Barème IR 2026</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5">
          {TRANCHES_IR.map((t, i) => (
            <div key={i} className="flex justify-between text-xs">
              <span className="text-muted-foreground">
                {formatEuros(t.min)} – {t.max ? formatEuros(t.max) : "∞"}
              </span>
              <Badge
                className={
                  t.taux === 0
                    ? "bg-green-100 text-green-700 text-xs"
                    : t.taux <= 0.11
                      ? "bg-blue-100 text-blue-700 text-xs"
                      : t.taux <= 0.30
                        ? "bg-yellow-100 text-yellow-700 text-xs"
                        : "bg-red-100 text-red-700 text-xs"
                }
              >
                {t.label}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Seuils TVA */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Franchise TVA 2026</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs">
          <div className="space-y-1.5">
            <p className="font-medium">Vente de marchandises</p>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Seuil de base</span>
              <span className="font-medium">85 000 €</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Seuil majoré</span>
              <span className="font-medium">93 500 €</span>
            </div>
          </div>
          <Separator />
          <div className="space-y-1.5">
            <p className="font-medium">Prestations de services</p>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Seuil de base</span>
              <span className="font-medium">37 500 €</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Seuil majoré</span>
              <span className="font-medium">41 250 €</span>
            </div>
          </div>
          <Separator />
          <p className="text-muted-foreground leading-relaxed">
            En franchise de TVA : vous ne facturez pas la TVA et ne pouvez pas la déduire sur vos
            achats. Mention obligatoire : <em>"TVA non applicable – art. 293 B du CGI"</em>.
          </p>
        </CardContent>
      </Card>

      {/* Abattements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Abattements forfaitaires IR</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Vente de marchandises (BIC)</span>
            <Badge variant="outline" className="text-xs">71%</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Prestations de services (BIC)</span>
            <Badge variant="outline" className="text-xs">50%</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Professions libérales (BNC)</span>
            <Badge variant="outline" className="text-xs">34%</Badge>
          </div>
          <p className="text-muted-foreground pt-1">
            Minimum : 305 € dans tous les cas.
          </p>
        </CardContent>
      </Card>

    </div>
  );
}
