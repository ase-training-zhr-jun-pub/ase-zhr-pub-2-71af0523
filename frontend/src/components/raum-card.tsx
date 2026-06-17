import { Users, MapPin, Star } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AusstattungBadges } from "@/components/ausstattung-badges"
import { useApp } from "@/lib/app-context"
import { istVerfuegbar, type Raum } from "@/lib/mock-data"
import { alternativeSlots } from "@/lib/slots"
import { cn } from "@/lib/utils"

export function RaumCard({
  raum,
  datum,
  von,
  bis,
  onAuswaehlen,
}: {
  raum: Raum
  datum: string
  von: string
  bis: string
  onAuswaehlen: (raum: Raum) => void
}) {
  const { istFavorit, toggleFavorit } = useApp()
  const fav = istFavorit(raum.id)
  const frei = istVerfuegbar(raum, datum, von, bis)
  const alt = !frei ? alternativeSlots(raum, datum, von, bis, 1)[0] : undefined

  return (
    <Card className="flex flex-row items-stretch gap-0 overflow-hidden p-0">
      {/* Farbakzent / Mini-Bild */}
      <div
        className="hidden w-2 shrink-0 sm:block"
        style={{ backgroundColor: raum.farbe }}
        aria-hidden
      />
      <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleFavorit(raum.id)}
                aria-label={fav ? "Favorit entfernen" : "Als Favorit markieren"}
                className="text-muted-foreground transition-colors hover:text-amber-500"
              >
                <Star className={cn("size-4", fav && "fill-amber-400 text-amber-400")} />
              </button>
              <h3 className="truncate font-semibold">{raum.name}</h3>
              <Badge variant="outline" className="shrink-0 font-normal">
                {raum.kategorie}
              </Badge>
            </div>
            <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="size-3.5" /> {raum.kapazitaet} Pers.
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5" /> {raum.etage}. OG · {raum.raumnummer}
              </span>
            </div>
          </div>
          {/* Verfügbarkeitsstatus */}
          <div className="shrink-0 text-right">
            {frei ? (
              <Badge className="gap-1 bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/15 dark:text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-500" /> frei
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-1">
                <span className="size-1.5 rounded-full bg-muted-foreground" /> belegt
              </Badge>
            )}
          </div>
        </div>

        <AusstattungBadges ausstattung={raum.ausstattung} />

        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <span className="text-xs text-muted-foreground">
            {frei
              ? `${von}–${bis} verfügbar`
              : alt
                ? `Alternativ frei: ${alt.von}–${alt.bis}`
                : "Heute ausgebucht"}
          </span>
          <Button size="sm" variant={frei ? "default" : "outline"} onClick={() => onAuswaehlen(raum)}>
            {frei ? "Auswählen" : "Details"}
          </Button>
        </div>
      </div>
    </Card>
  )
}
