# Ashliee Moore

Static GitHub Pages portfolio for **Ashliee Moore** — model · chef · promoter.

**Live site (after Pages is enabled):** `https://formula38.github.io/ashliee-moore/`

## Stack

- Plain HTML / CSS / JS (no framework)
- Google Fonts: Instrument Serif + Sora
- Public Instagram: [@ashliee007](https://www.instagram.com/ashliee007/)
- Album stills live in `assets/library/` (fashion, culinary, cosmetology, press, events). Captions live in `assets/library/captions.json`. Run `python3 scripts/import-looks.py` to refresh `js/looks.js`. Do not hotlink Google Photos. Do not scrape extra social media into the repo.

## Sections

1. **Hero** — slow rotating stills (roses, chartreuse, crimson) with a tilted look chip
2. **The Runway** — horizontal film-strip carousel of fashion stills
3. **The Glam** — tilted polaroid beauty close-ups
4. **The Kitchen** — host portrait plus a tasting-menu grid of plated stills
5. **The Scene** — slow marquee of events and brand presence
6. **About** — bio + Instagram
7. **Book** — Modeling / Culinary / Event promotion form (name, email, optional phone, date, location, optional social, message)

## Local preview

```bash
# any static server, e.g.
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## GitHub Pages

1. Repo Settings → Pages → Source: **Deploy from a branch**
2. Branch: `main` · folder: `/ (root)`
3. Save — site publishes at `https://formula38.github.io/ashliee-moore/`

## Booking form

Posts through [FormSubmit](https://formsubmit.co) to `royaltymaxwin@gmail.com` until `hello@ashliee-moore.com` can be created on the branded domain. The first live submit to a new mailbox sends an activation email — confirm it or later inquiries will not arrive.

## Custom domain (later)

`ashliee-moore.com` is not registered yet (NXDOMAIN as of 2026-09-14). Do **not** add a `CNAME` file or set Pages `cname` until the domain exists and DNS points here — GitHub would redirect the live github.io URL to a dead host.

When the name is registered:

1. Copy `CNAME.example` → `CNAME` with contents `ashliee-moore.com`
2. At the registrar, point DNS:
   - `A` records to GitHub Pages IPs, or
   - `CNAME` `www` → `formula38.github.io`
3. Enable HTTPS in Pages settings after DNS propagates

## Manager paperwork

Triple 8 talent-ops templates (agreements, rate card, invoices, etc.) live in [`management/paperwork/`](management/paperwork/). Not linked from the public site UI.

## Production stack (branch `feat/production-stack`)

Local only. GitHub Pages on `main` stays the live site until cutover. No new Postgres container: database `ashliee` on the existing Docker Postgres at `127.0.0.1:5432`. API listens on **8095** because 8080 is already taken. The Angular app listens on **4260** because Three Eights already uses 4200. The API compiles and runs on **JDK 21** (`JAVA_HOME=$HOME/.local/jdks/jdk-21.0.12.1+1`).

```bash
export JAVA_HOME="$HOME/.local/jdks/jdk-21.0.12.1+1"
cd api && mvn test && mvn spring-boot:run
cd web && npm start
```

Angular uses hash routes. The portfolio is one page per section (`/#/`, `/#/runway`, `/#/glam`, `/#/kitchen`, `/#/scene`, `/#/about`, `/#/book`) plus `/#/calendar` and `/#/admin/leads`. Admin login is local JWT (`admin` / `ASHLIEE_ADMIN_PASSWORD`, default `change-me`). Not auth38. Public calendar is `GET /api/v1/events` (public flag only).

Tests: `cd api && mvn test` and `cd web && npm test` plus `npm run bdd` (API must be up for the public-calendar scenario).

Analytics is skipped on this local build.

### Site launch checks

| Item | Result | Where |
| --- | --- | --- |
| Privacy | pass (stub) | `/#/privacy` |
| Terms | pass (stub) | `/#/terms` |
| CTA | pass | Book → `/#/book` |
| FAQ | pass | `/#/faq` |
| 404 | pass | Angular `**` route |
| robots.txt | pass | `web/public/robots.txt` |
| sitemap.xml | pass | `web/public/sitemap.xml` |
| Alt text | pass | look rows seeded with alt |
| Analytics | pass (explicit skip) | FAQ + this README |
| Favicon | pass | `web/public/favicon.ico` |

### Production build checks

| # | Item | Result |
| --- | --- | --- |
| 1 | Authentication | pass — `SecurityConfig` admin routes |
| 2 | Authorization | pass — public events query `is_public` |
| 3 | JWT | pass — `JwtService`, secret from env |
| 4 | Rate limiting | pass — bucket4j on inquiry + login |
| 5 | Load balancing | n/a — one instance |
| 6 | Redis | n/a — no measured hot read |
| 7 | WebSockets | n/a — REST only |
| 8 | Docker | n/a to add — existing Postgres on :5432 |
| 9 | API gateway | n/a — `/api/v1` on one service |
| 10 | Indexing | pass — Flyway `V1__schema.sql` |
| 11 | SSL/TLS | n/a locally; HTTPS waits on GCP |
| 12 | CORS | pass — localhost:4260 allow-list |
| 13 | SQL injection | pass — JPA only |
| 14 | API keys | pass — env defaults, none in the client bundle |
| 15 | RBAC | pass — anonymous vs `ROLE_ADMIN` |
| 16 | ABAC | n/a |
| 17 | Migrations | pass — Flyway |
| 18 | Reverse proxy | n/a — `web/proxy.conf.json` for dev only |
| 19 | System design | pass — one API, one SPA, one database |
| 20 | Git | pass — `feat/production-stack`, commit only when asked |
| 21 | Cloud | n/a |
| 22 | Distributed systems | n/a — this API owns the rows |
| 23 | Clean architecture | pass — controllers, repositories, `JwtService` |

## Next upgrades

- Select stills from the Google Photos content bucket into `assets/` ([TRI-211](https://linear.app/triple-8-media-group/issue/TRI-211))
- Optional: comp card PDF; more Kitchen imagery ([TRI-210](https://linear.app/triple-8-media-group/issue/TRI-210))
