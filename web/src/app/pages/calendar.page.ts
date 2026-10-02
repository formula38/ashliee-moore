import { Component, OnInit, inject, signal } from '@angular/core';
import { ApiService, CalendarEvent } from '../core/api.service';

@Component({
  selector: 'app-calendar',
  template: `
    <section class="section">
      <p class="eyebrow">Calendar</p>
      <h1>Public dates</h1>
      <p>Only events marked publicly viewable appear here. Private holds stay on the desk.</p>
      @if (events().length === 0) {
        <p>No public dates yet.</p>
      }
      <ul>
        @for (event of events(); track event.id) {
          <li><strong>{{ event.eventDate }}</strong> — {{ event.title }}</li>
        }
      </ul>
    </section>
  `,
})
export class CalendarPage implements OnInit {
  private readonly api = inject(ApiService);
  readonly events = signal<CalendarEvent[]>([]);

  ngOnInit() {
    this.api.publicEvents().subscribe((rows) => this.events.set(rows));
  }
}
