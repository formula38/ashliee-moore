import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService, Look } from '../core/api.service';
import { Zoom } from '../core/zoom';

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
          <img class="hero__image" [class.is-active]="i === index()" [src]="look.src" alt="" />
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
  `,
})
export class HomePage implements OnInit {
  private readonly api = inject(ApiService);
  private readonly zoom = inject(Zoom);
  private readonly reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  readonly heroes = signal<Look[]>([FALLBACK]);
  readonly index = signal(0);
  readonly labelSwapping = signal(false);
  private timer = 0;

  constructor() {
    inject(DestroyRef).onDestroy(() => window.clearInterval(this.timer));
  }

  ngOnInit() {
    this.api.looks('hero').subscribe((rows) => {
      if (rows.length) this.heroes.set(rows);
      this.play();
    });
  }

  active() {
    const rows = this.heroes();
    return rows[this.index()] ?? rows[0];
  }

  openHero(event: Event) {
    if ((event.target as HTMLElement).closest('a, button')) return;
    const look = this.active();
    this.zoom.open(look);
  }

  private play() {
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
