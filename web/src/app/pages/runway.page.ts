import { Component, OnInit, inject, signal } from '@angular/core';
import { ApiService, Look } from '../core/api.service';
import { FilmStrip } from '../shared/film-strip';
import { Reveal } from '../shared/reveal';

@Component({
  selector: 'app-runway',
  imports: [FilmStrip, Reveal],
  template: `
    <section class="section section--bleed section--runway" appReveal>
      <div class="section__intro">
        <p class="eyebrow">The Runway</p>
        <h1>Fashion presence with presence.</h1>
        <p>Editorial looks, runway walks, and brand storytelling — from Be ExquisiteU to nights that refuse to whisper.</p>
      </div>
      <app-film [looks]="looks()" label="Runway looks" />
    </section>
  `,
})
export class RunwayPage implements OnInit {
  private readonly api = inject(ApiService);
  readonly looks = signal<Look[]>([]);

  ngOnInit() {
    this.api.looks('runway').subscribe((rows) => this.looks.set(rows));
  }
}
