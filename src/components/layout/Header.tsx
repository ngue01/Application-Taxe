import { Badge } from "@/components/ui/badge";

export function Header() {
  return (
    <header className="border-b bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
            AE
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">
              Calculateur Taxes Auto-Entrepreneur
            </h1>
            <p className="text-xs text-gray-500">France · Millésime 2026</p>
          </div>
        </div>
        <Badge variant="secondary" className="text-xs">
          Taux URSSAF 2026
        </Badge>
      </div>
    </header>
  );
}
