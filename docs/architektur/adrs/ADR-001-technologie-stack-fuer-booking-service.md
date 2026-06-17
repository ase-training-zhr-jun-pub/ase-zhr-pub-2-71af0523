# ADR-001: Technologie-Stack für den Booking Service

**Status**: Akzeptiert

## Kontext

Der Booking Service ist das Backend von Calvin (vgl. [ADR-001 im arc42](../../arc42/adrs/ADR-001-frontend-prototyp-und-booking-service.md)). Er stellt eine REST-API bereit und muss folgende Anforderungen erfüllen:

- REST-API mit JSON
- Dateibasierte Datenbank (kein externer Datenbankserver nötig)
- Basic-Auth ohne Passwörter für den Prototypen; Okta-Integration wird nachgeliefert (siehe [Technische Schulden](../technische-schulden.md))
- Schnelle Entwicklung möglich

Evaluiert wurden drei Optionen.

## Optionen

### Option A – Spring Boot + Kotlin

| Kriterium | Bewertung |
|---|---|
| REST-API | Spring MVC, ausgereift, minimale Konfiguration |
| Dateibasierte DB | H2 ist First-Class-Feature — eine Dependency, keine weitere Konfiguration |
| Okta-Integration | `okta-spring-boot-starter`: offiziell von Okta supported, zwei Properties in `application.yml` |
| Transaktionssicherheit | `@Transactional` + Locking direkt verfügbar — kritisch für Doppelbuchungsschutz |
| Entwicklungsgeschwindigkeit | Kotlin-Data-Classes ersetzen Java-Boilerplate; Spring Initializr für schnellen Einstieg |

### Option B – FastAPI (Python)

| Kriterium | Bewertung |
|---|---|
| REST-API | Schnellstes Prototyping, automatische OpenAPI-Docs |
| Dateibasierte DB | SQLite über SQLAlchemy; Migrationen via Alembic zusätzlicher Overhead |
| Okta-Integration | Kein offizielles Package; JWT-Validierung manuell aufzubauen |
| Entwicklungsgeschwindigkeit | Sehr schnell; Typsicherheit nur via Pydantic |

### Option C – Node.js + TypeScript + Fastify + Prisma

| Kriterium | Bewertung |
|---|---|
| REST-API | Gleiche Sprache wie Frontend; Fastify performant |
| Dateibasierte DB | Prisma + SQLite; SQLite-Concurrency bei parallelen Buchungen ist bekanntes Problem |
| Okta-Integration | `@okta/okta-sdk-nodejs`; weniger nahtlos als Spring Security OIDC |
| Entwicklungsgeschwindigkeit | Gut; mehr manuelles Setup als Spring Initializr |

## Entscheidung

**Spring Boot + Kotlin**

## Begründung

- **Authentifizierung**: Für den Prototypen wird Basic-Auth eingesetzt — Spring Security unterstützt das ohne zusätzliche Abhängigkeiten. Die spätere Okta-Integration ist mit `okta-spring-boot-starter` direkt möglich, ohne den Stack zu wechseln.
- **Dateibasierte DB**: H2 funktioniert in Spring Boot ohne Konfigurationsaufwand. SQLite-Concurrency (Option C) wäre ein Risiko für den Doppelbuchungsschutz.
- **Transaktionssicherheit**: Spring `@Transactional` ist die robusteste Grundlage für konkurrierende Buchungsanfragen.
- **Java vs. Kotlin**: Java wäre ebenfalls möglich, da Spring Boot in beiden Sprachen identisch funktioniert. Kotlin wurde gewählt, weil der Entwickler Java kennt und Kotlin im Rahmen dieses Projekts erlernen möchte. Data Classes, Null Safety und die kompaktere Syntax machen den Einstieg für Java-Entwickler leicht.

## Konsequenzen

- **Positiv**: Solide Transaktionssemantik, minimale Konfiguration für H2, Basic-Auth sofort verfügbar, Okta-Migration ohne Stack-Wechsel möglich.
- **Lernaufwand**: Kotlin ist neu — die Spring-Konzepte aus Java sind aber direkt übertragbar, nur die Syntax unterscheidet sich.
- **Negativ**: JVM-Startup langsamer als Node.js oder Python; für diesen Use Case nicht relevant.
