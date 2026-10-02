import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiService, Look } from '../core/api.service';
import { Zoom } from '../core/zoom';

interface Lane {
  name: string;
  href: string;
  src: string;
  alt: string;
}

const FALLBACK: Look = {
  id: 0,
  section: 'hero',
  src: '/media/hero.jpg',
  alt: 'Editorial portrait of Ashliee Moore surrounded by red roses',
  caption: 'Look 01 — Roses',
};

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <section class="hero" (click)="openHero($event)">
      <div class="hero__media" aria-hidden="true">
        @for (look of heroes(); track look.id; let i = $index) {
          <img
            class="hero__image"
            [class.is-active]="i === index()"
            [src]="look.src"
            [style.object-position]="heroFrame(look.src)"
            alt=""
          />
        }
        <div class="hero__veil"></div>
      </div>
      <div class="hero__content">
        <p class="hero__look" [class.is-swapping]="labelSwapping()">{{ active().caption }}</p>
        <p class="hero__roles">Model · Chef · Promoter</p>
        <h1 class="hero__brand">Ashliee Moore</h1>
        <p class="hero__tagline">Curating taste, style, and experiences from the kitchen to the runway.</p>
        <div class="hero__actions">
          <a class="btn btn--primary" routerLink="/book">Book Ashliee</a>
          <a class="btn btn--ghost" routerLink="/runway">View work</a>
        </div>
      </div>
    </section>
    <p class="press-ticker" aria-label="Selected stages and publications">
      <span>Be ExquisiteU · Sac Fashion Pro · LiBush Africa · VVS Studios · Time Capsule · VIGOR · SALFORD · Old Sac</span>
      <span aria-hidden="true">Be ExquisiteU · Sac Fashion Pro · LiBush Africa · VVS Studios · Time Capsule · VIGOR · SALFORD · Old Sac</span>
    </p>
    <section class="lanes" aria-label="Work">
      @for (lane of lanes(); track lane.href) {
        <a class="lane" [routerLink]="lane.href">
          <img [src]="lane.src" [alt]="lane.alt" />
          <span>{{ lane.name }}</span>
        </a>
      }
    </section>
  `,
})
export class HomePage implements OnInit {
  private readonly api = inject(ApiService);
  private readonly zoom = inject(Zoom);
  private readonly reduceMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  readonly heroes = signal<Look[]>([FALLBACK]);
  readonly lanes = signal<Lane[]>([
    { name: 'The Runway', href: '/runway', src: FALLBACK.src, alt: 'Runway portrait of Ashliee Moore' },
    { name: 'The Kitchen', href: '/kitchen', src: FALLBACK.src, alt: 'Culinary portrait of Ashliee Moore' },
    { name: 'The Scene', href: '/scene', src: FALLBACK.src, alt: 'Event portrait of Ashliee Moore' },
  ]);
  readonly index = signal(0);
  readonly labelSwapping = signal(false);
  private timer = 0;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      if (typeof window !== 'undefined') window.clearInterval(this.timer);
    });
  }

  ngOnInit() {
    this.api.looks('hero').subscribe({
      next: (rows) => {
        if (rows.length) this.heroes.set(rows);
        this.play();
      },
      error: () => this.play(),
    });
    forkJoin({
      runway: this.api.looks('runway'),
      kitchen: this.api.looks('kitchen'),
      scene: this.api.looks('scene'),
    }).subscribe({
      next: ({ runway, kitchen, scene }) => {
        this.lanes.set([
          lane('The Runway', '/runway', runway),
          lane('The Kitchen', '/kitchen', kitchen),
          lane('The Scene', '/scene', scene),
        ]);
      },
      error: () => undefined,
    });
  }

  active() {
    const rows = this.heroes();
    return rows[this.index()] ?? rows[0];
  }

  /**
   * A wide hero is a short slice of a portrait. Full-body files keep the head
   * above the title. The seated rose portrait and the velvet close-up sit
   * lower in the file, so the same slice would hide the face.
   */
  heroFrame(src: string): string {
    if (src.endsWith('/hero.jpg')) return 'center 42%';
    if (src.endsWith('/fashion/011.jpg')) return 'center 35%';
    return 'center 12%';
  }

  openHero(event: Event) {
    if ((event.target as HTMLElement).closest('a, button')) return;
    const look = this.active();
    this.zoom.open(look);
  }

  private play() {
    if (typeof window === 'undefined') return;
    window.clearInterval(this.timer);
    if (this.reduceMotion || this.heroes().length < 2) return;
    this.timer = window.setInterval(() => {
      this.labelSwapping.set(true);
      window.setTimeout(() => {
        this.index.update((i) => (i + 1) % this.heroes().length);
        this.labelSwapping.set(false);
      }, 280);
    }, 5200);
  }
}

function lane(name: string, href: string, rows: Look[]): Lane {
  const look = rows[0];
  if (!look) return { name, href, src: FALLBACK.src, alt: name };
  return { name, href, src: look.src, alt: look.alt };
}
