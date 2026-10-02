import { Component, DestroyRef, ElementRef, afterNextRender, inject, input, viewChild } from '@angular/core';
import { Look } from '../core/api.service';
import { Zoom } from '../core/zoom';

@Component({
  selector: 'app-film',
  template: `
    <div class="film" (mouseenter)="pause()" (mouseleave)="resume()" (focusin)="pause()" (focusout)="resume()">
      <button class="film__nav film__nav--prev" type="button" (click)="go(-1)" [attr.aria-label]="prevLabel()">‹</button>
      <div
        class="film__track"
        #track
        data-looks
        tabindex="0"
        [attr.aria-label]="label()"
        (pointerdown)="down($event)"
        (pointermove)="move($event)"
        (pointerup)="up($event)"
        (pointercancel)="up($event)"
        (dragstart)="$event.preventDefault()"
      >
        @for (look of looks(); track $index; let i = $index) {
          <figure class="film__card">
            <img [src]="look.src" [alt]="look.alt" (click)="open(look, $event)" />
            <figcaption><span>{{ pad(i) }}</span> {{ look.caption }}</figcaption>
          </figure>
        }
      </div>
      <button class="film__nav film__nav--next" type="button" (click)="go(1)" [attr.aria-label]="nextLabel()">›</button>
    </div>
  `,
})
export class FilmStrip {
  readonly looks = input.required<Look[]>();
  readonly label = input('Looks');
  readonly prevLabel = input('Previous look');
  readonly nextLabel = input('Next look');

  private readonly zoom = inject(Zoom);
  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');
  private drag: { x: number; left: number; id: number } | null = null;
  private dragged = false;
  private timer = 0;
  private readonly reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => this.resume());
    destroyRef.onDestroy(() => window.clearInterval(this.timer));
  }

  pad(index: number) {
    return String(index + 1).padStart(2, '0');
  }

  open(look: Look, event: Event) {
    if (this.dragged) return;
    event.preventDefault();
    event.stopPropagation();
    this.zoom.open(look);
  }

  go(dir: number) {
    const track = this.track().nativeElement;
    const card = track.querySelector('.film__card');
    const step = card ? card.getBoundingClientRect().width + 16 : track.clientWidth * 0.8;
    const max = track.scrollWidth - track.clientWidth;
    const nextLeft = track.scrollLeft + dir * step;
    if (dir > 0 && nextLeft >= max - 8) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
      return;
    }
    if (dir < 0 && track.scrollLeft <= 8) {
      track.scrollTo({ left: max, behavior: 'smooth' });
      return;
    }
    track.scrollBy({ left: dir * step, behavior: 'smooth' });
  }

  down(event: PointerEvent) {
    const track = event.currentTarget as HTMLElement;
    this.dragged = false;
    this.drag = { x: event.clientX, left: track.scrollLeft, id: event.pointerId };
  }

  move(event: PointerEvent) {
    if (!this.drag) return;
    const track = event.currentTarget as HTMLElement;
    if (Math.abs(event.clientX - this.drag.x) > 12) {
      this.dragged = true;
      track.classList.add('is-dragging');
      if (!track.hasPointerCapture(this.drag.id)) track.setPointerCapture(this.drag.id);
    }
    if (!this.dragged) return;
    track.scrollLeft = this.drag.left - (event.clientX - this.drag.x);
  }

  up(event: PointerEvent) {
    const track = event.currentTarget as HTMLElement;
    this.drag = null;
    track.classList.remove('is-dragging');
    window.setTimeout(() => {
      this.dragged = false;
    }, 80);
  }

  pause() {
    window.clearInterval(this.timer);
  }

  resume() {
    this.pause();
    if (this.reduceMotion) return;
    this.timer = window.setInterval(() => {
      if (this.looks().length > 1) this.go(1);
    }, 4200);
  }
}
