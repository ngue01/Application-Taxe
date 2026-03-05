import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Purchase } from "@/types/tax.types";
import { calcTvaDeductible, formatEuros } from "@/lib/tax-calculator";
import { PURCHASE_CATEGORIES } from "@/lib/tax-constants";

interface PurchaseListProps {
  purchases: Purchase[];
  onRemove: (id: string) => void;
}

export function PurchaseList({ purchases, onRemove }: PurchaseListProps) {
  const totalTTC = purchases.reduce((s, p) => s + p.amountTTC, 0);
  const totalTVA = purchases.reduce((s, p) => s + calcTvaDeductible(p.amountTTC, p.tvaRate), 0);

  if (purchases.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground text-sm">
          Aucun achat enregistré. Ajoutez vos dépenses professionnelles ci-dessus.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm">Achats professionnels</CardTitle>
        <Badge variant="secondary">{purchases.length} achat{purchases.length > 1 ? "s" : ""}</Badge>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">TTC</TableHead>
                <TableHead className="text-right">TVA déd.</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases.map((p) => {
                const tva = calcTvaDeductible(p.amountTTC, p.tvaRate);
                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs whitespace-nowrap">
                        {PURCHASE_CATEGORIES[p.category] ?? p.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                      {new Date(p.date).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatEuros(p.amountTTC)}
                    </TableCell>
                    <TableCell className="text-right text-green-700 font-medium">
                      {tva > 0 ? formatEuros(tva) : <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 px-2"
                        onClick={() => onRemove(p.id)}
                      >
                        ✕
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Totaux */}
        <div className="border-t px-4 py-3 flex items-center justify-end gap-6 text-sm">
          <div className="text-right">
            <p className="text-muted-foreground text-xs">Total TTC</p>
            <p className="font-bold">{formatEuros(totalTTC)}</p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground text-xs">TVA déductible totale</p>
            <p className="font-bold text-green-700">{formatEuros(totalTVA)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
