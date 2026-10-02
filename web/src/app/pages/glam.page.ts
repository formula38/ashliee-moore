import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../core/api.service';
import { Zoom } from '../core/zoom';
import { Reveal } from '../shared/reveal';
import { SlotReel } from '../shared/slot-reel';

@Component({
  selector: 'app-glam',
  imports: [Reveal, RouterLink],
  template: `
    <section class="section spread section--glam" appReveal>
      <div class="section__intro">
        <p class="eyebrow">The Glam</p>
        <h1>Close-ups with a little mischief.</h1>
        <p>Beauty work, lashes, and looks that linger — polished enough for the cover, quirky enough to wink.</p>
      </div>
      <div class="polaroids" data-looks>
        @for (look of reel.slots(); track $index; let i = $index) {
          <figure class="polaroid" [class.polaroid--hero]="i === 1" [style.--tilt]="tilts[i] + 'deg'">
            <img [class.is-swapping]="reel.swapping()" [src]="look.src" [alt]="look.alt" (click)="zoom.open(look)" />
            <figcaption [class.is-swapping]="reel.swapping()">{{ look.caption }}</figcaption>
          </figure>
        }
      </div>
      <a class="text-link" routerLink="/kitchen">The Kitchen</a>
    </section>
  `,
})
export class GlamPage implements OnInit {
  private readonly api = inject(ApiService);
  private readonly destroyRef = inject(DestroyRef);
  readonly zoom = inject(Zoom);
  readonly tilts = [-7, 2, 6];
  readonly reel = new SlotReel(3, 7200);

  ngOnInit() {
    this.api.looks('glam').subscribe({
      next: (rows) => this.reel.load(rows, this.destroyRef),
      error: () => undefined,
    });
  }
}
