import { Component, OnInit, inject, signal } from '@angular/core';
import { ApiService, Look } from '../core/api.service';
import { FilmStrip } from '../shared/film-strip';
import { Reveal } from '../shared/reveal';

@Component({
  selector: 'app-scene',
  imports: [FilmStrip, Reveal],
  template: `
    <section class="section section--bleed section--scene" appReveal>
      <div class="section__intro">
        <p class="eyebrow">The Scene</p>
        <h1>Events, culture, and brand energy.</h1>
        <p>Promotion and presence for shows, studios, and community stages — LiBush Africa, VVS Studios, Old Sac, and beyond.</p>
      </div>
      <app-film [looks]="looks()" label="Scene stills" prevLabel="Previous scene" nextLabel="Next scene" />
    </section>
  `,
})
export class ScenePage implements OnInit {
  private readonly api = inject(ApiService);
  readonly looks = signal<Look[]>([]);

  ngOnInit() {
    this.api.looks('scene').subscribe((rows) => this.looks.set(rows));
  }
}
