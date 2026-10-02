import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService, Look } from '../core/api.service';
import { FilmStrip } from '../shared/film-strip';
import { Reveal } from '../shared/reveal';

@Component({
  selector: 'app-scene',
  imports: [FilmStrip, Reveal, RouterLink],
  template: `
    <section class="section spread section--bleed section--scene" appReveal>
      <div class="spread__split">
        <div class="section__intro">
          <p class="eyebrow">The Scene</p>
          <h1>Events, culture, and brand energy.</h1>
          <p>Promotion and presence for shows, studios, and community stages — LiBush Africa, VVS Studios, Old Sac, and beyond.</p>
          <a class="text-link" routerLink="/newsletter">The letter</a>
        </div>
        <app-film [looks]="looks()" label="Scene stills" prevLabel="Previous scene" nextLabel="Next scene" />
      </div>
    </section>
  `,
})
export class ScenePage implements OnInit {
  private readonly api = inject(ApiService);
  readonly looks = signal<Look[]>([]);

  ngOnInit() {
    this.api.looks('scene').subscribe({
      next: (rows) => this.looks.set(rows),
      error: () => undefined,
    });
  }
}
