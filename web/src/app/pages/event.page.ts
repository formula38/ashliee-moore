import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService, CalendarEvent } from '../core/api.service';
import { PageMeta, SEO } from '../core/page-meta';
import { safeHttp } from '../shared/event-copy';
import { RsvpLinks } from '../shared/rsvp-links';

@Component({
  selector: 'app-event',
  imports: [RouterLink, RsvpLinks],
  template: `
    <article class="section spread event-detail">
      <a class="text-link" routerLink="/events">All events</a>
      @if (event(); as row) {
        <div class="spread__split--even">
          <figure class="event-detail__flyer">
            @if (row.flyerSrc) {
              <img [src]="row.flyerSrc" [alt]="'Flyer for ' + row.title" />
            }
          </figure>
          <div>
            <p class="eyebrow">{{ row.eventDate }}</p>
            <h1>{{ row.title }}</h1>
            @if (row.notes) { <p>{{ row.notes }}</p> }
            <app-rsvp [email]="row.rsvpEmail" [url]="row.eventUrl" />
          </div>
        </div>
      } @else if (missing()) {
        <h1>Event not found</h1>
        <p>That date is not on the public board.</p>
      }
    </article>
  `,
})
export class EventPage implements OnInit {
  private readonly api = inject(ApiService);
  private readonly meta = inject(PageMeta);
  private readonly route = inject(ActivatedRoute);
  readonly event = signal<CalendarEvent | null>(null);
  readonly missing = signal(false);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isFinite(id)) {
      this.missing.set(true);
      return;
    }
    this.api.publicEvent(id).subscribe({
      next: (row) => {
        this.event.set(row);
        const page = safeHttp(row.eventUrl);
        this.meta.apply(
          { ...SEO.event, title: `${row.title} — Ashliee Moore`, description: row.notes || SEO.event.description, path: `/events/${row.id}`, image: row.flyerSrc },
          {
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: row.title,
            startDate: row.eventDate,
            description: row.notes || undefined,
            image: row.flyerSrc || undefined,
            url: page || undefined,
            organizer: { '@type': 'Person', name: 'Ashliee Moore' },
            location: {
              '@type': 'Place',
              address: { '@type': 'PostalAddress', addressLocality: 'Sacramento', addressRegion: 'CA' },
            },
          },
        );
      },
      error: () => {
        this.missing.set(true);
        this.meta.apply({ ...SEO.missing, path: '' });
      },
    });
  }
}
