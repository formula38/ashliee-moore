import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiService, Look } from '../core/api.service';
import { Zoom } from '../core/zoom';
import { Reveal } from '../shared/reveal';
import { SlotReel } from '../shared/slot-reel';

@Component({
  selector: 'app-kitchen',
  imports: [RouterLink, Reveal],
  template: `
    <section class="section section--kitchen" appReveal>
      <div class="kitchen">
        <div class="kitchen__copy">
          <p class="eyebrow">The Kitchen</p>
          <h1>Hosting flavor. Serving the night.</h1>
          <p>Culinary hosting and dining experiences across Sacramento — seafood boils, plated lobster, and nights that taste like an event.</p>
          <a class="text-link" routerLink="/book">Book a culinary appearance →</a>
        </div>
        @if (host(); as portrait) {
          <figure class="kitchen__media">
            <img [src]="portrait.src" [alt]="portrait.alt" (click)="zoom.open(portrait)" />
          </figure>
        }
      </div>
      <div class="tasting" aria-label="Tasting menu" data-looks>
        @for (look of reel.slots(); track $index; let first = $first; let i = $index) {
          <figure [class.tasting__hero]="first">
            <img [class.is-swapping]="reel.swapping()" [src]="look.src" [alt]="look.alt" (click)="zoom.open(look)" />
            <figcaption [class.is-swapping]="reel.swapping()"><span>{{ pad(i) }}</span> {{ look.caption }}</figcaption>
          </figure>
        }
      </div>
    </section>
  `,
})
export class KitchenPage implements OnInit {
  private readonly api = inject(ApiService);
  private readonly destroyRef = inject(DestroyRef);
  readonly zoom = inject(Zoom);
  readonly host = signal<Look | null>(null);
  readonly reel = new SlotReel(5, 7600);

  ngOnInit() {
    forkJoin({
      kitchen: this.api.looks('kitchen'),
      tasting: this.api.looks('tasting'),
    }).subscribe(({ kitchen, tasting }) => {
      const plates = tasting.length ? tasting : kitchen.slice(1);
      this.host.set(kitchen[0] ?? null);
      this.reel.load(plates, this.destroyRef);
    });
  }

  pad(index: number) {
    return String(index + 1).padStart(2, '0');
  }
}
