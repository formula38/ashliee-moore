import { Directive, afterNextRender, signal } from '@angular/core';

@Directive({
  selector: '[appReveal]',
  host: {
    '[class.is-visible]': 'visible()',
    'attr.data-reveal': '',
  },
})
export class Reveal {
  readonly visible = signal(false);

  constructor() {
    afterNextRender(() => {
      setTimeout(() => this.visible.set(true), 40);
    });
  }
}
