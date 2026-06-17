import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { Plus, CalendarDays, Users, MapPin, ArrowRight, Server } from "lucide-react"
import { LinkButton } from "@/components/ui/link-button"
import { useApp } from "@/lib/app-context"
import {
  HEUTE,
  KOLLEGEN,
  RAEUME,
  belegungenAmTag,
  raumById,
  standortName,
} from "@/lib/mock-data"
import { formatDatumKurz, formatDatum } from "@/lib/format"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AKTUELLER_NUTZER } from "@/lib/mock-data"

export function DashboardPage() {
  const { standortId, buchungen } = useApp()
  const [backendStatus, setBackendStatus] = useState<string | null>(null)
  const [backendError, setBackendError] = useState<string | null>(null)

  useEffect(() => {
    fetch("api/hello")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.text()
      })
      .then((text) => setBackendStatus(text))
      .catch((err) => setBackendError(err.message))
  }, [])

  const kommende = buchungen
    .filter((b) => b.status === "bestätigt" && b.datum >= HEUTE)
    .sort((a, b) => a.datum.localeCompare(b.datum) || a.von.localeCompare(b.von))
    .slice(0, 3)

  const kollegenHeute = KOLLEGEN.filter(
    (k) => k.standortId === standortId && k.imBueroAn.includes(HEUTE),
  )

  // Auslastung am Standort heute
  const raeumeStandort = RAEUME.filter((r) => r.standortId === standortId)
  const belegteHeute = raeumeStandort.filter((r) => belegungenAmTag(r, HEUTE).length > 0).length
  const auslastung = raeumeStandort.length
    ? Math.round((belegteHeute / raeumeStandort.length) * 100)
    : 0

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        titel={`Willkommen zurück, ${AKTUELLER_NUTZER.name.split(" ")[0]} 👋`}
        beschreibung={formatDatum(HEUTE)}
        aktion={
          <LinkButton to="/raeume">
            <Plus className="size-4" /> Raum buchen
          </LinkButton>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Nächste Buchungen */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="size-5 text-muted-foreground" /> Deine nächsten Buchungen
            </CardTitle>
            <LinkButton variant="ghost" size="sm" to="/buchungen">
              Alle <ArrowRight className="size-4" />
            </LinkButton>
          </CardHeader>
          <CardContent className="space-y-3">
            {kommende.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Keine anstehenden Buchungen.{" "}
                <Link to="/raeume" className="text-primary underline-offset-4 hover:underline">
                  Jetzt Raum buchen
                </Link>
              </p>
            )}
            {kommende.map((b) => {
              const raum = raumById(b.raumId)
              return (
                <div
                  key={b.id}
                  className="flex items-center gap-4 rounded-lg border p-3"
                >
                  <div
                    className="flex h-12 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: raum?.farbe }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{b.titel}</div>
                    <div className="text-sm text-muted-foreground">
                      {raum?.name} · {standortName(b.standortId)}
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="font-medium">{formatDatumKurz(b.datum)}</div>
                    <div className="text-muted-foreground">
                      {b.von}–{b.bis}
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Rechte Spalte */}
        <div className="space-y-6">
          {/* Kollegen heute */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="size-5 text-muted-foreground" /> Kollegen heute
              </CardTitle>
              <Badge variant="secondary">{kollegenHeute.length}</Badge>
            </CardHeader>
            <CardContent>
              {kollegenHeute.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Heute niemand in {standortName(standortId)} eingetragen.
                </p>
              ) : (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {kollegenHeute.slice(0, 6).map((k) => (
                      <div key={k.id} className="flex items-center gap-2">
                        <Avatar className="size-7">
                          <AvatarFallback className="text-xs">{k.initialen}</AvatarFallback>
                        </Avatar>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {kollegenHeute
                      .slice(0, 3)
                      .map((k) => k.name.split(" ")[0])
                      .join(", ")}
                    {kollegenHeute.length > 3 && ` +${kollegenHeute.length - 3} weitere`} in{" "}
                    {standortName(standortId)}
                  </p>
                  <LinkButton
                    variant="outline"
                    size="sm"
                    className="w-full"
                    to="/kollegen"
                  >
                    Alle anzeigen
                  </LinkButton>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Backend-Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Server className="size-5 text-muted-foreground" /> Backend-Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {backendStatus === null && backendError === null && (
                <p className="text-sm text-muted-foreground">Verbinde…</p>
              )}
              {backendStatus !== null && (
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-green-500" />
                  <span className="text-sm font-medium">{backendStatus}</span>
                </div>
              )}
              {backendError !== null && (
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-red-500" />
                  <span className="text-sm text-destructive">{backendError}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Auslastung */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="size-5 text-muted-foreground" /> Auslastung heute
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-end justify-between">
                <span className="text-3xl font-semibold">{auslastung}%</span>
                <span className="text-sm text-muted-foreground">
                  {belegteHeute} von {raeumeStandort.length} Räumen belegt
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${auslastung}%` }}
                />
              </div>
              <p className="pt-1 text-xs text-muted-foreground">
                Standort {standortName(standortId)}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
