import { useLocation, useNavigate } from "react-router-dom"
import { CheckCircle2, CalendarDays, Clock, MapPin, Users, FileText, CalendarCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { standortName, type Buchung, type Raum } from "@/lib/mock-data"
import { formatDatum, dauerText } from "@/lib/format"

interface BestaetigungState {
  buchung: Buchung
  raum: Raum
}

export function BuchungsbestaetigungPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const state = location.state as BestaetigungState | null

  if (!state?.buchung || !state?.raum) {
    return (
      <div className="mx-auto max-w-2xl">
        <PageHeader
          titel="Buchungsbestätigung"
          beschreibung="Keine Buchungsdaten vorhanden."
        />
        <Button onClick={() => navigate("/raeume")}>Raum buchen</Button>
      </div>
    )
  }

  const { buchung, raum } = state

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        titel="Buchung bestätigt"
        beschreibung="Dein Raum wurde erfolgreich gebucht."
      />

      {/* Erfolgsmeldung */}
      <div className="mb-6 flex items-center gap-3 rounded-lg bg-emerald-500/10 px-4 py-3 text-emerald-700 dark:text-emerald-400">
        <CheckCircle2 className="size-5 shrink-0" />
        <p className="text-sm font-medium">
          {raum.name} wurde verbindlich gebucht.
        </p>
      </div>

      {/* Buchungsdetails */}
      <Card>
        <CardContent className="pt-6">
          {/* Raumfarb-Streifen + Raumname */}
          <div className="mb-5 flex items-center gap-3">
            <div
              className="h-12 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: raum.farbe }}
            />
            <div>
              <h2 className="text-lg font-semibold">{buchung.titel}</h2>
              <p className="text-sm text-muted-foreground">{raum.name} · {raum.kategorie}</p>
            </div>
          </div>

          <dl className="space-y-3">
            <div className="flex items-start gap-3 text-sm">
              <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div>
                <dt className="text-xs text-muted-foreground">Standort</dt>
                <dd className="font-medium">
                  {standortName(raum.standortId)} · {raum.etage}. OG · Raum {raum.raumnummer}
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm">
              <CalendarDays className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div>
                <dt className="text-xs text-muted-foreground">Datum</dt>
                <dd className="font-medium">{formatDatum(buchung.datum)}</dd>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm">
              <Clock className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div>
                <dt className="text-xs text-muted-foreground">Zeit</dt>
                <dd className="font-medium">
                  {buchung.von}–{buchung.bis} ({dauerText(buchung.von, buchung.bis)})
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm">
              <Users className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div>
                <dt className="text-xs text-muted-foreground">Teilnehmer</dt>
                <dd className="font-medium">{buchung.teilnehmer} {buchung.teilnehmer === 1 ? "Person" : "Personen"}</dd>
              </div>
            </div>

            {buchung.notiz && (
              <div className="flex items-start gap-3 text-sm">
                <FileText className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div>
                  <dt className="text-xs text-muted-foreground">Notiz</dt>
                  <dd className="font-medium">{buchung.notiz}</dd>
                </div>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>

      {/* Aktionen */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button
          className="flex-1"
          onClick={() => navigate("/buchungen")}
        >
          <CalendarCheck className="size-4" />
          Zur Buchungsübersicht
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => navigate("/raeume")}
        >
          Neuen Raum buchen
        </Button>
      </div>
    </div>
  )
}
