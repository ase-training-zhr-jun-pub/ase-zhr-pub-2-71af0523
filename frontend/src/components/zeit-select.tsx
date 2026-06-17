// Zeitoptionen im 30-Minuten-Raster von 08:00 bis 18:00.
export const ZEITEN: string[] = (() => {
  const out: string[] = []
  for (let h = 8; h <= 18; h++) {
    out.push(`${String(h).padStart(2, "0")}:00`)
    if (h < 18) out.push(`${String(h).padStart(2, "0")}:30`)
  }
  return out
})()
