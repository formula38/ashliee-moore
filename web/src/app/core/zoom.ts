import { Injectable, signal } from '@angular/core';

export interface Shot {
  src: string;
  alt: string;
  caption: string;
}

@Injectable({ providedIn: 'root' })
export class Zoom {
  readonly shot = signal<Shot | null>(null);

  open(look: Shot) {
    this.shot.set({ src: look.src, alt: look.alt, caption: look.caption });
  }

  clear() {
    this.shot.set(null);
  }
}
