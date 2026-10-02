import { Component, input } from '@angular/core';
import { mailto, safeHttp } from './event-copy';

@Component({
  selector: 'app-rsvp',
  template: `
    <div class="rsvp">
      @if (mail()) {
        <a class="btn btn--primary" [href]="mail()">RSVP by email</a>
      }
      @if (page()) {
        <a class="btn btn--ghost" [href]="page()" target="_blank" rel="noopener noreferrer">Event page</a>
      }
    </div>
  `,
})
export class RsvpLinks {
  readonly email = input<string>();
  readonly url = input<string>();

  mail() {
    return mailto(this.email());
  }

  page() {
    return safeHttp(this.url());
  }
}
