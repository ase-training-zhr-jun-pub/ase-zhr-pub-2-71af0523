import { Monitor, PenLine, Video, Phone, Projector } from "lucide-react"
import type { Ausstattung } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const ICON: Record<Ausstattung, typeof Monitor> = {
  Bildschirm: Monitor,
  Whiteboard: PenLine,
  Videokonferenz: Video,
  Telefon: Phone,
  Beamer: Projector,
}

export function AusstattungBadges({
  ausstattung,
  className,
}: {
  ausstattung: Ausstattung[]
  className?: string
}) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {ausstattung.map((a) => {
        const Icon = ICON[a]
        return (
          <Badge key={a} variant="secondary" className="gap-1 font-normal">
            <Icon className="size-3.5" />
            {a}
          </Badge>
        )
      })}
    </div>
  )
}

export function AusstattungIcon({ art, className }: { art: Ausstattung; className?: string }) {
  const Icon = ICON[art]
  return <Icon className={className} />
}
