# Ashliee Moore

Static GitHub Pages portfolio for **Ashliee Moore** — model · chef · promoter.

**Live site (after Pages is enabled):** `https://formula38.github.io/ashliee-moore/`

## Stack

- Plain HTML / CSS / JS (no framework)
- Google Fonts: Instrument Serif + Sora
- Public Instagram imagery from [@ashliee007](https://www.instagram.com/ashliee007/)

## Sections

1. **Hero** — full-bleed rose editorial; brand-first name; CTAs
2. **The Runway** — modeling / fashion shows
3. **The Kitchen** — culinary hosting / dining experiences
4. **The Scene** — events / promotion / brand presence
5. **About** — bio + Instagram
6. **Book** — Modeling / Culinary / Event promotion form (`mailto:hello@ashliee-moore.com`)

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

## Custom domain (later)

1. Copy `CNAME.example` → `CNAME` with contents `ashliee-moore.com`
2. At GoDaddy, point DNS:
   - `A` records to GitHub Pages IPs, or
   - `CNAME` `www` → `formula38.github.io`
3. Enable HTTPS in Pages settings after DNS propagates

## Next upgrades

- Swap `mailto` booking for Formspree / Basin / Netlify Forms
- Replace IG CDN assets with higher-res originals when available
- Optional: comp card PDF; more Kitchen imagery
