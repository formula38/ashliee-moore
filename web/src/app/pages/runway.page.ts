import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService, Look } from '../core/api.service';
import { FilmStrip } from '../shared/film-strip';
import { Reveal } from '../shared/reveal';

@Component({
  selector: 'app-runway',
  imports: [FilmStrip, Reveal, RouterLink],
  template: `
    <section class="section spread section--bleed section--runway" appReveal>
      <div class="spread__split">
        <div class="section__intro">
          <p class="eyebrow">The Runway</p>
          <h1>Fashion presence with presence.</h1>
          <p>Editorial looks, runway walks, and brand storytelling — from Be ExquisiteU to nights that refuse to whisper.</p>
          <a class="text-link" routerLink="/glam">The Glam</a>
        </div>
        <app-film [looks]="looks()" label="Runway looks" />
      </div>
    </section>
  `,
})
export class RunwayPage implements OnInit {
  private readonly api = inject(ApiService);
  readonly looks = signal<Look[]>([]);

  ngOnInit() {
    this.api.looks('runway').subscribe({
      next: (rows) => this.looks.set(rows),
      error: () => undefined,
    });
  }
}
