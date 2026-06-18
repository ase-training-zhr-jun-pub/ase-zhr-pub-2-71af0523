import { test, expect } from '@playwright/test'

test.beforeEach(async ({ context }) => {
  // Sauberer Ausgangszustand: kein localStorage aus vorherigen Läufen
  await context.addInitScript(() => localStorage.clear())
})

test('Raumbuchungsprozess von der Suche bis zur Bestätigung', async ({ page }) => {
  const BUCHUNGSTITEL = 'E2E-Testbuchung'

  // 1. Buchungsübersicht öffnen
  await page.goto('/buchungen')
  const kommendTab = page.getByRole('tab', { name: /Kommend/ })
  await expect(kommendTab).toBeVisible()

  // 2. Bisherige Buchungen merken
  const tabTextVorher = await kommendTab.textContent()
  const anzahlVorher = parseInt(tabTextVorher?.match(/\((\d+)\)/)?.[1] ?? '0')

  // 3. Standort-Seite (Räume suchen) öffnen
  await page.getByRole('link', { name: 'Räume suchen' }).click()

  // 4. Standort wechseln zu Berlin
  await page.getByLabel('Standort wählen').click()
  await page.getByRole('option', { name: 'Berlin' }).click()

  // 5. Datum wählen (keine Mock-Belegungen → alle Räume frei)
  await page.getByLabel('Datum').fill('2026-07-01')

  // 6. Ersten verfügbaren Raum auswählen
  const auswaehlenButton = page.getByRole('button', { name: 'Auswählen' }).first()
  await expect(auswaehlenButton).toBeVisible()
  await auswaehlenButton.click()

  // 7. Dialog Schritt 1 – Raumdetails prüfen, dann weiter
  const weiterButton = page.getByRole('button', { name: /Weiter/ })
  await expect(weiterButton).toBeVisible()
  await weiterButton.click()

  // 8. Dialog Schritt 2 – Meetingtitel eingeben und verbindlich buchen
  await page.getByLabel('Meetingtitel').fill(BUCHUNGSTITEL)
  await page.getByRole('button', { name: 'Verbindlich buchen' }).click()

  // 9. Buchungsübersicht öffnen
  await page.getByRole('link', { name: 'Meine Buchungen' }).click()

  // 10. Neue Buchung verifizieren
  const kommendTabNach = page.getByRole('tab', { name: /Kommend/ })
  await expect(kommendTabNach).toBeVisible()
  const tabTextNachher = await kommendTabNach.textContent()
  const anzahlNachher = parseInt(tabTextNachher?.match(/\((\d+)\)/)?.[1] ?? '0')

  expect(anzahlNachher).toBe(anzahlVorher + 1)
  await expect(page.getByText(BUCHUNGSTITEL)).toBeVisible()
})
