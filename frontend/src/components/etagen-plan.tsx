import { Users } from "lucide-react"
import { Card } from "@/components/ui/card"
import { istVerfuegbar, type Raum } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

/**
 * Schematischer Etagenplan: gruppiert Räume nach Etage und stellt sie als
 * klickbare Kacheln dar (neues Feature, Alternative zur Listenansicht).
 */
export function EtagenPlan({
  raeume,
  datum,
  von,
  bis,
  onAuswaehlen,
}: {
  raeume: Raum[]
  datum: string
  von: string
  bis: string
  onAuswaehlen: (raum: Raum) => void
}) {
  const etagen = [...new Set(raeume.map((r) => r.etage))].sort((a, b) => b - a)

  return (
    <div className="space-y-4">
      {etagen.map((etage) => (
        <Card key={etage} className="p-4">
          <div className="mb-3 text-sm font-semibold text-muted-foreground">{etage}. Obergeschoss</div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {raeume
              .filter((r) => r.etage === etage)
              .map((r) => {
                const frei = istVerfuegbar(r, datum, von, bis)
                return (
                  <button
                    key={r.id}
                    onClick={() => onAuswaehlen(r)}
                    className={cn(
                      "group relative flex h-24 flex-col justify-between overflow-hidden rounded-lg border-2 p-3 text-left transition-all hover:shadow-md",
                      frei
                        ? "border-emerald-500/40 bg-emerald-500/5 hover:border-emerald-500"
                        : "border-border bg-muted/40",
                    )}
                  >
                    <span
                      className="absolute right-0 top-0 h-full w-1.5"
                      style={{ backgroundColor: r.farbe }}
                    />
                    <div className="font-medium">{r.name}</div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="size-3" /> {r.kapazitaet}
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-1.5 py-0.5 font-medium",
                          frei
                            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {frei ? "frei" : "belegt"}
                      </span>
                    </div>
                  </button>
                )
              })}
          </div>
        </Card>
      ))}
    </div>
  )
}
