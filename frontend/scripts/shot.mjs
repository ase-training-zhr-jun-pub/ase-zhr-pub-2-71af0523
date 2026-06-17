import { chromium } from "playwright"

const BASE = "http://localhost:5173"
const routes = process.argv[2]
  ? process.argv[2].split(",")
  : ["/", "/raeume", "/buchungen", "/kollegen", "/favoriten"]
const dark = process.argv[3] === "dark"

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })

const errors = []
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text())
})
page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message))

if (dark) {
  await page.goto(BASE + "/")
  await page.evaluate(() => localStorage.setItem("calvin.theme", '"dark"'))
}

for (const r of routes) {
  const name = r === "/" ? "dashboard" : r.replaceAll("/", "_").replace(/^_/, "")
  await page.goto(BASE + r, { waitUntil: "load" })
  await page.waitForTimeout(1200)
  const file = `/tmp/shot-${name}${dark ? "-dark" : ""}.png`
  await page.screenshot({ path: file, fullPage: true })
  console.log("OK " + r + " -> " + file)
}

if (errors.length) {
  console.log("\n--- CONSOLE ERRORS ---")
  for (const e of errors) console.log(e)
} else {
  console.log("\nKeine Konsolenfehler.")
}

await browser.close()
