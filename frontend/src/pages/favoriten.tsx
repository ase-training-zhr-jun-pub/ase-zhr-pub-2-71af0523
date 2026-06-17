import { useState } from "react"
import { Link } from "react-router-dom"
import { Star } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { RaumCard } from "@/components/raum-card"
import { BuchungDialog } from "@/components/buchung-dialog"
import { Card } from "@/components/ui/card"
import { useApp } from "@/lib/app-context"
import { HEUTE, RAEUME, standortName, type Raum } from "@/lib/mock-data"
import type { SucheParams } from "@/lib/slots"

export function FavoritenPage() {
  const { favoriten } = useApp()
  const [gewaehlterRaum, setGewaehlterRaum] = useState<Raum | null>(null)
  const [dialogOffen, setDialogOffen] = useState(false)

  // Standard-Suchparameter für die Schnellbuchung aus den Favoriten
  const suche: SucheParams = { datum: HEUTE, von: "10:00", bis: "11:00", teilnehmer: 1 }

  const favRaeume = RAEUME.filter((r) => favoriten.includes(r.id))

  // nach Standort gruppieren
  const nachStandort = favRaeume.reduce<Record<string, Raum[]>>((acc, r) => {
    ;(acc[r.standortId] ??= []).push(r)
    return acc
  }, {})

  function oeffneDialog(raum: Raum) {
    setGewaehlterRaum(raum)
    setDialogOffen(true)
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader titel="Favoriten" beschreibung="Deine markierten Räume – schnell wieder buchen" />

      {favRaeume.length === 0 ? (
        <Card className="p-10 text-center">
          <Star className="mx-auto mb-3 size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Noch keine Favoriten. Markiere Räume mit dem{" "}
            <Star className="inline size-3.5 -translate-y-px text-amber-400" />-Symbol in der{" "}
            <Link to="/raeume" className="text-primary underline-offset-4 hover:underline">
              Raumsuche
            </Link>
            .
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(nachStandort).map(([sid, raeume]) => (
            <div key={sid} className="space-y-3">
              <h2 className="text-sm font-semibold text-muted-foreground">{standortName(sid)}</h2>
              {raeume.map((r) => (
                <RaumCard
                  key={r.id}
                  raum={r}
                  datum={suche.datum}
                  von={suche.von}
                  bis={suche.bis}
                  onAuswaehlen={oeffneDialog}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      <BuchungDialog
        raum={gewaehlterRaum}
        suche={suche}
        open={dialogOffen}
        onOpenChange={setDialogOffen}
      />
    </div>
  )
}
