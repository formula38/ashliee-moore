import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, CalendarEvent } from '../core/api.service';

@Component({
  selector: 'app-admin-calendar',
  imports: [FormsModule],
  template: `
    <section class="section">
      <h1>Calendar desk</h1>
      <form (ngSubmit)="add()">
        <input name="date" type="date" [(ngModel)]="draft.eventDate" required />
        <input name="title" placeholder="Title" [(ngModel)]="draft.title" required />
        <label><input type="checkbox" name="pub" [(ngModel)]="draft.publiclyViewable" /> Publicly viewable</label>
        <button class="btn" type="submit">Save event</button>
      </form>
      <ul>
        @for (event of events(); track event.id) {
          <li>
            {{ event.eventDate }} — {{ event.title }}
            <button type="button" (click)="toggle(event)">
              {{ event.publiclyViewable ? 'Make private' : 'Make public' }}
            </button>
          </li>
        }
      </ul>
    </section>
  `,
})
export class AdminCalendarPage implements OnInit {
  private readonly api = inject(ApiService);
  readonly events = signal<CalendarEvent[]>([]);
  draft: CalendarEvent = { eventDate: '', title: '', status: 'hold', publiclyViewable: false };

  ngOnInit() {
    this.reload();
  }

  reload() {
    this.api.events().subscribe((rows) => this.events.set(rows));
  }

  add() {
    this.api.saveEvent(this.draft).subscribe(() => {
      this.draft = { eventDate: '', title: '', status: 'hold', publiclyViewable: false };
      this.reload();
    });
  }

  toggle(event: CalendarEvent) {
    this.api.saveEvent({ ...event, publiclyViewable: !event.publiclyViewable }).subscribe(() => this.reload());
  }
}
