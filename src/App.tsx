import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/layout/Header";
import { TaxForm } from "@/components/features/TaxForm";
import { TaxResults } from "@/components/features/TaxResults";
import { EmptyResults } from "@/components/features/EmptyResults";
import { PurchaseForm } from "@/components/features/PurchaseForm";
import { PurchaseList } from "@/components/features/PurchaseList";
import { InfoPanel } from "@/components/features/InfoPanel";
import { useTaxCalculator } from "@/hooks/useTaxCalculator";

export default function App() {
  const { formState, updateForm, purchases, addPurchase, removePurchase, result } =
    useTaxCalculator();

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="max-w-6xl mx-auto px-4 py-6">
          <Tabs defaultValue="calcul">
            <TabsList className="mb-6">
              <TabsTrigger value="calcul">Calcul des taxes</TabsTrigger>
              <TabsTrigger value="achats">
                Achats professionnels
                {purchases.length > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 text-xs bg-blue-600 text-white rounded-full">
                    {purchases.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="infos">Guide & Taux</TabsTrigger>
            </TabsList>

            {/* Onglet principal : calcul */}
            <TabsContent value="calcul">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <TaxForm formState={formState} onChange={updateForm} />
                </div>
                <div>
                  {result ? (
                    <TaxResults
                      result={result}
                      activityType={formState.activityType}
                      optVersementLiberatoire={formState.optVersementLiberatoire}
                    />
                  ) : (
                    <EmptyResults />
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Onglet achats */}
            <TabsContent value="achats">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-2">
                  <PurchaseForm onAdd={addPurchase} />
                </div>
                <div className="lg:col-span-3">
                  <PurchaseList purchases={purchases} onRemove={removePurchase} />
                </div>
              </div>
            </TabsContent>

            {/* Onglet infos */}
            <TabsContent value="infos">
              <div className="max-w-2xl">
                <InfoPanel />
              </div>
            </TabsContent>
          </Tabs>
        </main>

        <footer className="text-center text-xs text-muted-foreground py-6 border-t mt-8">
          Calculs basés sur les taux URSSAF 2026. Outil indicatif — consultez un expert-comptable
          pour votre situation personnelle.
        </footer>
      </div>
    </TooltipProvider>
  );
}
