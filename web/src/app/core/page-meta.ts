import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { environment } from '../../environments/environment';
import { FAQ } from '../pages/legal-copy';

export interface Seo {
  title: string;
  description: string;
  path: string;
  index?: boolean;
  kind?: 'person' | 'article' | 'faq';
  image?: string;
}

export const SEO = {
  home: {
    title: 'Ashliee Moore — Sacramento Model, Chef, and Promoter',
    description: 'Ashliee Moore is a Sacramento model, culinary host, and event promoter. Runway, kitchen, and scene, from one desk.',
    path: '/',
    kind: 'person',
  },
  runway: {
    title: 'The Runway — Ashliee Moore, Sacramento Model',
    description: 'Editorial looks and runway walks by Sacramento model Ashliee Moore, from Be ExquisiteU to nights that refuse to whisper.',
    path: '/runway',
  },
  glam: {
    title: 'The Glam — Beauty Looks by Ashliee Moore',
    description: 'Close-up beauty work, lashes, and cover looks by Sacramento model Ashliee Moore.',
    path: '/glam',
  },
  kitchen: {
    title: 'The Kitchen — Culinary Host in Sacramento',
    description: 'Culinary hosting and dining experiences with Ashliee Moore across Sacramento.',
    path: '/kitchen',
  },
  scene: {
    title: 'The Scene — Sacramento Event Promotion',
    description: 'Event promotion and presence for shows, studios, and community stages in Sacramento.',
    path: '/scene',
  },
  about: {
    title: 'About Ashliee Moore — Sacramento',
    description: 'Ashliee Moore is a Sacramento-based model, culinary host, and promoter building one brand across the runway, the kitchen, and the scene.',
    path: '/about',
  },
  book: {
    title: 'Book Ashliee Moore in Sacramento',
    description: 'Request Ashliee Moore for modeling, culinary hosting, or event promotion in Sacramento.',
    path: '/book',
  },
  calendar: {
    title: 'Public Dates — Ashliee Moore',
    description: 'Public dates for Ashliee Moore. Holds and private notes stay on the desk until an operator marks them viewable.',
    path: '/calendar',
  },
  newsletter: {
    title: 'Sacramento Fashion Newsletter — Ashliee Moore',
    description: 'A monthly Sacramento fashion letter built from the public dates and scene stills on Ashliee Moore’s desk.',
    path: '/newsletter',
    kind: 'article',
  },
  events: {
    title: 'Sacramento Events — Ashliee Moore',
    description: 'Upcoming public events with Ashliee Moore. Read the details, then RSVP by email or on the host’s event page.',
    path: '/events',
  },
  event: {
    title: 'Event — Ashliee Moore',
    description: 'A public event with Ashliee Moore in Sacramento.',
    path: '/events',
  },
  privacy: {
    title: 'Privacy — Ashliee Moore',
    description: 'What the Ashliee Moore booking form stores, who can see an inquiry, and how to ask for a correction.',
    path: '/privacy',
  },
  terms: {
    title: 'Terms — Ashliee Moore',
    description: 'A booking request for Ashliee Moore is confirmed only when a written deal memo covers the date, fee, travel, and photo use.',
    path: '/terms',
  },
  faq: {
    title: 'FAQ — Ashliee Moore, Sacramento',
    description: 'Booking, rates, public dates, RSVP, and what Ashliee Moore takes on from Sacramento.',
    path: '/faq',
    kind: 'faq',
  },
  missing: {
    title: 'Page not found — Ashliee Moore',
    description: 'That address is not on this site.',
    path: '',
    index: false,
  },
} as const satisfies Record<string, Seo>;

const PERSON = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Ashliee Moore',
  jobTitle: ['Model', 'Culinary host', 'Promoter'],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Sacramento',
    addressRegion: 'CA',
  },
  sameAs: ['https://www.instagram.com/ashliee007/'],
};

@Injectable({ providedIn: 'root' })
export class PageMeta {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  constructor() {
    const router = inject(Router);
    router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      let route = router.routerState.snapshot.root;
      while (route.firstChild) route = route.firstChild;
      this.apply((route.data['seo'] as Seo | undefined) ?? SEO.missing);
    });
  }

  apply(seo: Seo, extra?: object) {
    this.title.setTitle(seo.title);
    this.meta.updateTag({ name: 'description', content: seo.description });
    this.meta.updateTag({ property: 'og:title', content: seo.title });
    this.meta.updateTag({ property: 'og:description', content: seo.description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ name: 'robots', content: seo.index === false ? 'noindex, nofollow' : 'index, follow' });
    if (seo.image) this.meta.updateTag({ property: 'og:image', content: seo.image });
    this.writeCanonical(seo.path);
    this.writeJsonLd(JSON.stringify(extra ?? structured(seo)));
  }

  private writeJsonLd(json: string) {
    const current = this.document.getElementById('page-ld');
    const script = current ?? this.document.createElement('script');
    script.id = 'page-ld';
    script.setAttribute('type', 'application/ld+json');
    script.textContent = json;
    if (!current) this.document.head.appendChild(script);
  }

  private writeCanonical(path: string) {
    const origin = environment.publicOrigin.replace(/\/$/, '');
    const current = this.document.querySelector('link[rel="canonical"]');
    if (!origin || !path) {
      current?.remove();
      return;
    }
    const link = current ?? this.document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', origin + path);
    if (!current) this.document.head.appendChild(link);
  }
}

function structured(seo: Seo) {
  if (seo.kind === 'person') return PERSON;
  if (seo.kind === 'article') {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: seo.title,
      description: seo.description,
      author: { '@type': 'Person', name: 'Ashliee Moore' },
    };
  }
  if (seo.kind === 'faq') {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ.map((item) => question(item.q, item.a)),
    };
  }
  return { '@context': 'https://schema.org', '@type': 'WebPage', name: seo.title, description: seo.description };
}

function question(name: string, text: string) {
  return { '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } };
}
