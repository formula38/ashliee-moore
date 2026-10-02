import { DestroyRef, signal } from '@angular/core';
import { Look } from '../core/api.service';

/** Cycles a fixed number of slots through a larger pool, matching the Pages fade. */
export class SlotReel {
  readonly slots = signal<Look[]>([]);
  readonly swapping = signal(false);
  private cursor = 0;
  private timer = 0;

  constructor(private readonly count: number, private readonly intervalMs: number) {}

  load(pool: Look[], destroyRef: DestroyRef) {
    if (typeof window === 'undefined') {
      this.slots.set(pool.slice(0, Math.min(this.count, pool.length)));
      return;
    }
    window.clearInterval(this.timer);
    const size = Math.min(this.count, pool.length);
    this.slots.set(pool.slice(0, size));
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || pool.length <= size || size < 1) return;
    this.timer = window.setInterval(() => this.advance(pool, size), this.intervalMs);
    destroyRef.onDestroy(() => window.clearInterval(this.timer));
  }

  private advance(pool: Look[], size: number) {
    this.swapping.set(true);
    window.setTimeout(() => {
      this.cursor = (this.cursor + 1) % pool.length;
      const next: Look[] = [];
      for (let i = 0; i < size; i += 1) {
        next.push(pool[(this.cursor + i) % pool.length]);
      }
      this.slots.set(next);
      this.swapping.set(false);
    }, 680);
  }
}
