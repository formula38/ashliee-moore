import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiService, CalendarEvent, Look } from '../core/api.service';
import { PageMeta, SEO } from '../core/page-meta';
import { excerpt as clip, letterLede, monthKey, monthLabel, thisMonth } from '../shared/event-copy';

@Component({
  selector: 'app-newsletter',
  imports: [RouterLink],
  template: `
    <article class="section spread letter">
      <header class="letter__mast">
        <p class="eyebrow">Sacramento Fashion</p>
        <h1>{{ label() }}</h1>
        <p>{{ lede() }}</p>
        @if (months().length) {
          <nav class="letter__archive" aria-label="Earlier letters">
            @for (month of months(); track month) {
              <a routerLink="/newsletter" [queryParams]="{ month }" [class.is-on]="month === key()">{{ monthName(month) }}</a>
            }
          </nav>
        }
      </header>
      <div class="letter__body">
        @for (look of stills(); track look.id) {
          <figure>
            <img [src]="look.src" [alt]="look.alt" />
            <figcaption>{{ look.caption }}</figcaption>
          </figure>
        }
      </div>
      <aside class="letter__rail">
        <p class="eyebrow">Public dates</p>
        @for (event of rows(); track event.id) {
          <a [routerLink]="['/events', event.id]">
            <time [attr.datetime]="event.eventDate">{{ event.eventDate }}</time>
            <strong>{{ event.title }}</strong>
            @if (excerpt(event.notes)) { <span>{{ excerpt(event.notes) }}</span> }
          </a>
        } @empty {
          <p>No public dates in this letter.</p>
        }
      </aside>
      <a class="text-link" routerLink="/events">Events</a>
    </article>
  `,
})
export class NewsletterPage implements OnInit {
  private readonly api = inject(ApiService);
  private readonly meta = inject(PageMeta);
  private readonly route = inject(ActivatedRoute);
  readonly key = signal(thisMonth());
  readonly rows = signal<CalendarEvent[]>([]);
  readonly stills = signal<Look[]>([]);
  readonly months = signal<string[]>([]);
  readonly lede = signal(letterLede(monthLabel(thisMonth()), []));

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      const asked = params.get('month');
      if (asked && /^\d{4}-\d{2}$/.test(asked)) this.key.set(asked);
      this.publish();
    });
    forkJoin({ events: this.api.publicEvents(), scene: this.api.looks('scene') }).subscribe({
      next: ({ events, scene }) => {
        const keys = [...new Set(events.map((event) => monthKey(event.eventDate)))].sort().reverse();
        this.months.set(keys);
        this.stills.set(scene.slice(0, 3));
        this.events = events;
        this.publish();
      },
      error: () => undefined,
    });
  }

  label() {
    return monthLabel(this.key());
  }

  monthName(key: string) {
    return monthLabel(key);
  }

  excerpt(notes?: string) {
    return clip(notes);
  }

  private events: CalendarEvent[] = [];

  private publish() {
    const rows = this.events.filter((event) => monthKey(event.eventDate) === this.key());
    this.rows.set(rows);
    const lede = letterLede(monthLabel(this.key()), rows);
    this.lede.set(lede);
    this.meta.apply(SEO.newsletter, {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: `Sacramento Fashion — ${monthLabel(this.key())}`,
      description: lede,
      author: { '@type': 'Person', name: 'Ashliee Moore' },
      ...(rows.length
        ? {
            hasPart: {
              '@type': 'ItemList',
              itemListElement: rows.map((event, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: event.title,
                url: `/events/${event.id}`,
              })),
            },
          }
        : {}),
    });
  }
}
