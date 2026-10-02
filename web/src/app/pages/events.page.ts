import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService, CalendarEvent } from '../core/api.service';
import { excerpt as clip } from '../shared/event-copy';
import { RsvpLinks } from '../shared/rsvp-links';

@Component({
  selector: 'app-events',
  imports: [RouterLink, RsvpLinks],
  template: `
    <section class="section spread">
      <div class="section__intro">
        <p class="eyebrow">Events</p>
        <h1>Sacramento events</h1>
        <p>Public dates only. RSVP by email, or open the host’s own page.</p>
      </div>
      <div class="events-board">
        @for (event of upcoming(); track event.id) {
          <article class="event-card">
            <a class="event-card__media" [routerLink]="['/events', event.id]">
              @if (event.flyerSrc) {
                <img [src]="event.flyerSrc" [alt]="'Flyer for ' + event.title" />
              } @else {
                <span class="event-card__date">{{ event.eventDate }}</span>
              }
            </a>
            <p class="eyebrow">{{ event.eventDate }}</p>
            <h2><a [routerLink]="['/events', event.id]">{{ event.title }}</a></h2>
            @if (excerpt(event.notes)) { <p>{{ excerpt(event.notes) }}</p> }
            <app-rsvp [email]="event.rsvpEmail" [url]="event.eventUrl" />
          </article>
        } @empty {
          <p>No upcoming public events yet.</p>
        }
      </div>
      <a class="text-link" routerLink="/calendar">Calendar</a>
    </section>
  `,
})
export class EventsPage implements OnInit {
  private readonly api = inject(ApiService);
  readonly upcoming = signal<CalendarEvent[]>([]);

  ngOnInit() {
    const today = new Date();
    const key = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    this.api.publicEvents().subscribe({
      next: (rows) => this.upcoming.set(rows.filter((event) => event.eventDate >= key)),
      error: () => undefined,
    });
  }

  excerpt(notes?: string) {
    return clip(notes);
  }
}
