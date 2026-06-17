# CLAUDE.md – Backend (Calvin Booking Service)

Dieser Hinweis gilt für die Arbeit im Ordner `backend/`. Halte dich zusätzlich an
die globalen Projektregeln unter `../.claude/rules/` (u. a. Conventional Commits und
die Nutzung der `docs/`).

## Domänen- & Architekturdokumentation

Lies bei Unklarheiten **immer** zuerst die Doku unter `../docs/`:

- **Architektur (arc42)**: [`../docs/arc42/arc42.md`](../docs/arc42/arc42.md)
- **ADR – Technologie-Stack des Booking Service**: [`../docs/architektur/adrs/ADR-001-technologie-stack-fuer-booking-service.md`](../docs/architektur/adrs/ADR-001-technologie-stack-fuer-booking-service.md)
- **ADR – Frontend-Prototyp & Booking Service**: [`../docs/arc42/adrs/ADR-001-frontend-prototyp-und-booking-service.md`](../docs/arc42/adrs/ADR-001-frontend-prototyp-und-booking-service.md)
- **Technische Schulden**: [`../docs/architektur/technische-schulden.md`](../docs/architektur/technische-schulden.md)
- **Qualitätsanforderungen**: [`../docs/architektur/qualitätsanforderungen.md`](../docs/architektur/qualitätsanforderungen.md)
- **Produktvision & Glossar**: [`../docs/produkt/produktvision.md`](../docs/produkt/produktvision.md), [`../docs/produkt/glossar.md`](../docs/produkt/glossar.md)

Der Booking Service ist das Backend von Calvin (INNOQ Raum- und Arbeitsplatz-
buchung). Er stellt eine REST-API bereit, enthält die **Buchungslogik, Validierung
und Konfliktprüfung** und arbeitet nur mit den IDs aus den Mock-Stammdaten der SPA.

## Backend-Technologie

- **Sprache**: Kotlin 1.9.25 (JVM-Toolchain **Java 21**)
- **Framework**: Spring Boot 3.3.5 (Spring MVC / `spring-boot-starter-web`)
- **Build**: Gradle 8.10 (Kotlin DSL, Wrapper `./gradlew`)
- **JSON**: Jackson (`jackson-module-kotlin`)
- **DB (geplant)**: H2, dateibasiert (kein externer DB-Server)
- **Auth**: Basic-Auth ohne Passwörter (Prototyp); Okta-Integration ist nachgelagert
- **Tests**: JUnit 5 (`spring-boot-starter-test`)
- **Port**: `8081` (siehe `application.properties`)

## Ordner-Struktur

```text
backend/
├── build.gradle.kts            # Build-Definition (Plugins, Dependencies, Java-21-Toolchain)
├── settings.gradle.kts         # rootProject.name = "calvin-booking-service"
├── gradlew / gradlew.bat       # Gradle Wrapper
├── gradle/wrapper/             # Wrapper-Konfiguration (Gradle 8.10)
└── src/
    ├── main/
    │   ├── kotlin/com/innoq/calvin/
    │   │   ├── CalvinApplication.kt   # Spring-Boot-Einstiegspunkt
    │   │   └── HelloController.kt      # Beispiel-REST-Controller (/api/hello)
    │   └── resources/
    │       └── application.properties # App-Name, Port
    └── test/                          # (noch nicht vorhanden – hier Tests anlegen)
```

Basis-Package: **`com.innoq.calvin`**.

## Backend-Architektur

Spring-typische **Layered Architecture**. Neue fachliche Bausteine entlang der
Schichten in Sub-Packages unter `com.innoq.calvin` ablegen:

- `…/web` (oder `…/api`) – REST-Controller, DTOs, Request-/Response-Mapping
- `…/domain` – Domänenmodell (Kotlin Data Classes), fachliche Regeln
- `…/service` – Anwendungslogik, Buchungs-/Konfliktprüfung, `@Transactional`
- `…/repository` (oder `…/persistence`) – Datenzugriff (H2)

**Wichtig für die Domäne**: Doppelbuchungsschutz ist das kritische Qualitätsziel
(QS-2). Konkurrierende Buchungen serverseitig über `@Transactional` + geeignetes
Locking absichern – nicht allein auf Client-Validierung verlassen.

> Die Architektur ist noch im Aufbau (aktuell nur ein Hello-Controller). Bei
> strukturellen Entscheidungen die ADRs prüfen und ggf. einen neuen ADR ergänzen.

## Wichtige Dateien

| Datei | Zweck |
|-------|-------|
| `build.gradle.kts` | Dependencies, Plugins, Java-21-Toolchain |
| `src/main/kotlin/com/innoq/calvin/CalvinApplication.kt` | `@SpringBootApplication`, `main()` |
| `src/main/kotlin/com/innoq/calvin/HelloController.kt` | Beispiel-Controller, Muster für neue Endpunkte |
| `src/main/resources/application.properties` | App-Name, `server.port=8081` |
| `settings.gradle.kts` | Projektname |

## Wichtige Bash-Commands

Aus dem `backend/`-Ordner ausführen:

```bash
./gradlew build            # Kompilieren + Tests + JAR bauen
./gradlew bootRun          # App lokal starten (Port 8081)
./gradlew test             # Nur Tests ausführen
./gradlew check            # Tests + Verifikation
./gradlew clean            # build/ aufräumen
./gradlew dependencies     # Dependency-Baum anzeigen
./gradlew tasks            # Verfügbare Tasks auflisten

# Smoke-Test bei laufender App:
curl http://localhost:8081/api/hello
```

**Java 21 ist erforderlich.** Ist `JAVA_HOME`/`java` nicht gesetzt, schlägt Gradle
fehl. JDK liegt unter `/usr/lib/jvm/java-21-openjdk-amd64`:

```bash
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
```

## Run Configurations

- **Lokal**: `./gradlew bootRun` → erreichbar unter `http://localhost:8081`.
- **JAR**: `./gradlew build` → `java -jar build/libs/calvin-booking-service-0.0.1-SNAPSHOT.jar`.
- **Profil/Port**: über `application.properties` bzw. `--server.port=…`.
- **Hinter dem Crucible-Proxy**: Frontend ruft die API relativ auf; siehe
  [`../.claude/rules/betrieb-hinter-proxy.md`](../.claude/rules/betrieb-hinter-proxy.md).
  Das Backend selbst läuft unverändert auf `8081`.

## Code Smells / Worauf achten

- **Kein Java-Boilerplate**: Kotlin nutzen – `data class`, Null-Safety, `val` statt
  `var`, keine unnötigen Getter/Setter.
- **Keine Geschäftslogik im Controller**: Controller dünn halten, Logik in Services.
- **Doppelbuchungen**: Nie ungeschützte Read-Modify-Write-Buchungen – immer
  transaktional + Konfliktprüfung serverseitig.
- **DTO vs. Domäne trennen**: Keine internen Entities direkt über die API ausliefern.
- **`!!`-Operator vermeiden**: Nullability sauber modellieren statt erzwingen.
- **Keine Secrets/Passwörter** im Code oder in `application.properties` (Prototyp
  nutzt Basic-Auth ohne Passwörter).
- **Tests fehlen aktuell** – neue Logik mit JUnit-5-Tests in `src/test/kotlin` absichern.

## Weitere Hinweise für Claude Code

- **Conventional Commits** einhalten (`feat:`, `fix:`, `chore:` …).
- Bei Bibliotheks-/Framework-Fragen (Spring Boot, Kotlin, Gradle) **context7** für
  aktuelle Doku nutzen, statt aus dem Gedächtnis zu antworten.
- Die SPA hält die Stammdaten als Mock-Daten; das Backend arbeitet nur mit deren
  **IDs** – keine eigene Stammdatenverwaltung aufbauen.
- Die API-Spezifikation wird als **OpenAPI-Dokument im Backend** gepflegt – bei
  API-Änderungen aktuell halten.
