import { Component, OnInit, inject, signal } from '@angular/core';
import { ApiService, Look } from '../core/api.service';
import { Zoom } from '../core/zoom';
import { Reveal } from '../shared/reveal';

const FALLBACK: Look = {
  id: 0,
  section: 'about',
  src: '/media/about-02.jpg',
  alt: 'Editorial portrait of Ashliee Moore surrounded by red roses',
  caption: 'Roses',
};

@Component({
  selector: 'app-about',
  imports: [Reveal],
  template: `
    <section class="section section--about" appReveal>
      <div class="about">
        @if (portrait(); as look) {
          <figure class="about__media">
            <img [src]="look.src" [alt]="look.alt" (click)="zoom.open(look)" />
          </figure>
        }
        <div class="about__copy">
          <p class="eyebrow">About</p>
          <h1>Rich skin. Soft heart. Expensive energy.</h1>
          <p>
            Ashliee Moore is a Sacramento-based model, culinary host, and promoter building one brand across the runway,
            the kitchen, and the scene. Her work moves between fashion shows, dining experiences, and cultural events —
            always with roses in the frame and presence in the room.
          </p>
          <blockquote>“A window to the soul, where roses bloom in vibrant red.”</blockquote>
          <a class="btn btn--ghost" href="https://www.instagram.com/ashliee007/" target="_blank" rel="noopener noreferrer">&#64;ashliee007 on Instagram</a>
        </div>
      </div>
    </section>
  `,
})
export class AboutPage implements OnInit {
  private readonly api = inject(ApiService);
  readonly zoom = inject(Zoom);
  readonly portrait = signal<Look | null>(FALLBACK);

  ngOnInit() {
    this.api.looks('about').subscribe((rows) => {
      if (rows[0]) this.portrait.set(rows[0]);
    });
  }
}
