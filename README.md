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

## Next upgrades

- Select stills from the Google Photos content bucket into `assets/` ([TRI-211](https://linear.app/triple-8-media-group/issue/TRI-211))
- Optional: comp card PDF; more Kitchen imagery ([TRI-210](https://linear.app/triple-8-media-group/issue/TRI-210))
