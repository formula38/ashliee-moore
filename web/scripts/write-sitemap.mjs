import { readFileSync, writeFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/environments/environment.ts', import.meta.url), 'utf8');
const origin = (source.match(/publicOrigin:\s*'([^']*)'/)?.[1] ?? '').replace(/\/$/, '');
const paths = ['/', '/runway', '/glam', '/kitchen', '/scene', '/about', '/book', '/calendar', '/newsletter', '/events', '/privacy', '/terms', '/faq'];

const locs = origin
  ? paths.map((path) => `  <url><loc>${origin}${path === '/' ? '/' : path}</loc></url>`).join('\n')
  : '';

writeFileSync(new URL('../public/sitemap.xml', import.meta.url), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${locs}
</urlset>
`);

const sitemapLine = origin ? `\nSitemap: ${origin}/sitemap.xml\n` : '\n';
writeFileSync(new URL('../public/robots.txt', import.meta.url), `User-agent: *
Allow: /
Disallow: /admin${sitemapLine}`);
