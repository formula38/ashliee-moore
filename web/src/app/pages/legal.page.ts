import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-legal',
  template: `
    <section class="section">
      @switch (doc) {
        @case ('privacy') {
          <h1>Privacy</h1>
          <p>Stub until counsel reviews it. Booking inquiries store your name, email, phone, and message so Triple 8 can reply. We do not sell that list. Analytics is not installed on this local build.</p>
        }
        @case ('terms') {
          <h1>Terms</h1>
          <p>Stub until counsel reviews it. Bookings are requests, not confirmed jobs, until Triple 8 sends a deal memo. No over-sexualized work is accepted.</p>
        }
        @default {
          <h1>FAQ</h1>
          <h2>Where is Ashliee based?</h2>
          <p>Sacramento, California.</p>
          <h2>What can I book?</h2>
          <p>Modeling, culinary hosting, and event promotion.</p>
          <h2>Which dates are public?</h2>
          <p>The calendar shows only events an operator marked publicly viewable. Holds and private notes stay off this page.</p>
          <h2>Is there analytics?</h2>
          <p>Not on this local build. Tracking stays off until an operator chooses a snippet.</p>
          <h2>Instagram?</h2>
          <p><a href="https://www.instagram.com/ashliee007/">&#64;ashliee007</a></p>
        }
      }
    </section>
  `,
})
export class LegalPage {
  readonly doc = inject(ActivatedRoute).snapshot.data['doc'] as string;
}
