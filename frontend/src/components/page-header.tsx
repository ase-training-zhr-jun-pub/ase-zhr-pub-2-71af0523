import type { ReactNode } from "react"

export function PageHeader({
  titel,
  beschreibung,
  aktion,
}: {
  titel: string
  beschreibung?: string
  aktion?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{titel}</h1>
        {beschreibung && <p className="mt-1 text-sm text-muted-foreground">{beschreibung}</p>}
      </div>
      {aktion}
    </div>
  )
}
