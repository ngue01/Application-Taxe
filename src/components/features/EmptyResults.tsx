import { Card, CardContent } from "@/components/ui/card";

export function EmptyResults() {
  return (
    <Card className="border-dashed">
      <CardContent className="py-14 text-center space-y-2">
        <div className="text-4xl">&#128200;</div>
        <p className="text-muted-foreground text-sm">
          Entrez votre chiffre d'affaires pour voir les calculs en temps réel.
        </p>
      </CardContent>
    </Card>
  );
}
