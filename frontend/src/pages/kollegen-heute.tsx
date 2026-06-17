import { useState } from "react"
import { Users, CalendarDays } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useApp } from "@/lib/app-context"
import { HEUTE, KOLLEGEN, standortName } from "@/lib/mock-data"
import { formatDatum } from "@/lib/format"

export function KollegenHeutePage() {
  const { standortId } = useApp()
  const [datum, setDatum] = useState(HEUTE)

  const anwesend = KOLLEGEN.filter(
    (k) => k.standortId === standortId && k.imBueroAn.includes(datum),
  )

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        titel="Kollegen im Büro"
        beschreibung={`Wer ist in ${standortName(standortId)} vor Ort?`}
        aktion={
          <div className="space-y-1.5">
            <Label htmlFor="k-datum" className="sr-only">
              Datum
            </Label>
            <Input
              id="k-datum"
              type="date"
              value={datum}
              onChange={(e) => setDatum(e.target.value)}
              className="w-[170px]"
            />
          </div>
        }
      />

      <Card>
        <CardContent className="pt-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2 font-medium">
              <CalendarDays className="size-4 text-muted-foreground" />
              {formatDatum(datum)}
            </span>
            <Badge variant="secondary" className="gap-1">
              <Users className="size-3.5" /> {anwesend.length} im Büro
            </Badge>
          </div>

          {anwesend.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              An diesem Tag ist niemand in {standortName(standortId)} eingetragen.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {anwesend.map((k) => (
                <div key={k.id} className="flex items-center gap-3 rounded-lg border p-3">
                  <Avatar className="size-10">
                    <AvatarFallback>{k.initialen}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="truncate font-medium">{k.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {standortName(k.standortId)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Tipp: Nutze deinen Bürotag für persönliche Treffen mit anwesenden Kolleg:innen.
      </p>
    </div>
  )
}
