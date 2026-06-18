import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import {
  CalendarDays,
  Clock,
  Users,
  MapPin,
  Share2,
  Pencil,
  Trash2,
  Info,
  Plus,
} from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { LinkButton } from "@/components/ui/link-button"
import { ZEITEN } from "@/components/zeit-select"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useApp } from "@/lib/app-context"
import { HEUTE, raumById, standortName, type Buchung } from "@/lib/mock-data"
import { formatDatum, formatDatumKurz, dauerText } from "@/lib/format"

export function MeineBuchungenPage() {
  const { buchungen } = useApp()

  const kommend = buchungen
    .filter((b) => b.status === "bestätigt" && b.datum >= HEUTE)
    .sort((a, b) => a.datum.localeCompare(b.datum) || a.von.localeCompare(b.von))
  const vergangen = buchungen
    .filter((b) => b.status === "vergangen" || (b.status !== "storniert" && b.datum < HEUTE))
    .sort((a, b) => b.datum.localeCompare(a.datum))
  const storniert = buchungen.filter((b) => b.status === "storniert")

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        titel="Meine Buchungen"
        beschreibung="Deine Raumbuchungen verwalten"
        aktion={
          <LinkButton to="/raeume">
            <Plus className="size-4" /> Neue Buchung
          </LinkButton>
        }
      />

      <Tabs defaultValue="kommend">
        <TabsList>
          <TabsTrigger value="kommend">Kommend ({kommend.length})</TabsTrigger>
          <TabsTrigger value="vergangen">Vergangen ({vergangen.length})</TabsTrigger>
          {storniert.length > 0 && (
            <TabsTrigger value="storniert">Storniert ({storniert.length})</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="kommend" className="mt-4 space-y-3">
          {kommend.length === 0 ? (
            <LeerHinweis />
          ) : (
            kommend.map((b) => <BuchungZeile key={b.id} buchung={b} aktiv />)
          )}
        </TabsContent>
        <TabsContent value="vergangen" className="mt-4 space-y-3">
          {vergangen.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Keine vergangenen Buchungen.
            </p>
          ) : (
            vergangen.map((b) => <BuchungZeile key={b.id} buchung={b} />)
          )}
        </TabsContent>
        <TabsContent value="storniert" className="mt-4 space-y-3">
          {storniert.map((b) => (
            <BuchungZeile key={b.id} buchung={b} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function LeerHinweis() {
  return (
    <Card className="p-10 text-center">
      <CalendarDays className="mx-auto mb-3 size-8 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">Du hast keine anstehenden Buchungen.</p>
      <LinkButton to="/raeume" className="mt-4">
        <Plus className="size-4" /> Raum buchen
      </LinkButton>
    </Card>
  )
}

function BuchungZeile({ buchung, aktiv = false }: { buchung: Buchung; aktiv?: boolean }) {
  const { stornieren } = useApp()
  const navigate = useNavigate()
  const raum = raumById(buchung.raumId)
  const [aendernOffen, setAendernOffen] = useState(false)
  const [stornoOffen, setStornoOffen] = useState(false)

  function teilen() {
    const text = `Raumbuchung: ${buchung.titel}\n${raum?.name} · ${standortName(
      buchung.standortId,
    )}\n${formatDatum(buchung.datum)} · ${buchung.von}–${buchung.bis}`
    navigator.clipboard?.writeText(text).catch(() => {})
    toast.success("Buchungsdetails kopiert", { description: "In die Zwischenablage – bereit zum Teilen." })
  }

  return (
    <>
      <Card
        className="cursor-pointer p-4 transition-shadow hover:shadow-md"
        onClick={() => navigate(`/buchungen/${buchung.id}`)}
      >
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: raum?.farbe }} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-semibold">{buchung.titel}</h3>
              {buchung.status === "storniert" && (
                <Badge variant="secondary" className="text-destructive">
                  storniert
                </Badge>
              )}
              {buchung.status === "bestätigt" && (
                <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/15 dark:text-emerald-400">
                  bestätigt
                </Badge>
              )}
            </div>
            <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5" /> {raum?.name} · {standortName(buchung.standortId)}
              </span>
              <span className="flex items-center gap-1">
                <CalendarDays className="size-3.5" /> {formatDatumKurz(buchung.datum)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" /> {buchung.von}–{buchung.bis} ({dauerText(buchung.von, buchung.bis)})
              </span>
              <span className="flex items-center gap-1">
                <Users className="size-3.5" /> {buchung.teilnehmer}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/buchungen/${buchung.id}`)
            }}
          >
            <Info className="size-4" /> Details
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              teilen()
            }}
          >
            <Share2 className="size-4" /> Teilen
          </Button>
          {aktiv && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setAendernOffen(true)
                }}
              >
                <Pencil className="size-4" /> Ändern
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setStornoOffen(true)
                }}
              >
                <Trash2 className="size-4" /> Stornieren
              </Button>
            </>
          )}
        </div>
      </Card>

      <AendernDialog buchung={buchung} open={aendernOffen} onOpenChange={setAendernOffen} />

      {/* Stornieren bestätigen */}
      <Dialog open={stornoOffen} onOpenChange={setStornoOffen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Buchung stornieren?</DialogTitle>
            <DialogDescription>
              „{buchung.titel}" am {formatDatum(buchung.datum)} ({buchung.von}–{buchung.bis}) wird
              storniert. Der Raum wird wieder für andere verfügbar.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStornoOffen(false)}>
              Abbrechen
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                stornieren(buchung.id)
                setStornoOffen(false)
                toast.success("Buchung storniert")
              }}
            >
              Stornieren
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function AendernDialog({
  buchung,
  open,
  onOpenChange,
}: {
  buchung: Buchung
  open: boolean
  onOpenChange: (o: boolean) => void
}) {
  const { aendern } = useApp()
  const [datum, setDatum] = useState(buchung.datum)
  const [von, setVon] = useState(buchung.von)
  const [bis, setBis] = useState(buchung.bis)

  const ungueltig = von >= bis

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Buchung ändern</DialogTitle>
          <DialogDescription>„{buchung.titel}" verschieben</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="a-datum">Datum</Label>
            <Input id="a-datum" type="date" value={datum} onChange={(e) => setDatum(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="a-von">Von</Label>
              <select
                id="a-von"
                className="h-9 w-full rounded-md border bg-transparent px-3 text-sm"
                value={von}
                onChange={(e) => setVon(e.target.value)}
              >
                {ZEITEN.map((z) => (
                  <option key={z}>{z}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="a-bis">Bis</Label>
              <select
                id="a-bis"
                className="h-9 w-full rounded-md border bg-transparent px-3 text-sm"
                value={bis}
                onChange={(e) => setBis(e.target.value)}
              >
                {ZEITEN.map((z) => (
                  <option key={z}>{z}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button
            disabled={ungueltig}
            onClick={() => {
              aendern(buchung.id, { datum, von, bis })
              onOpenChange(false)
              toast.success("Buchung aktualisiert", {
                description: `${formatDatumKurz(datum)} · ${von}–${bis}`,
              })
            }}
          >
            Speichern
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
