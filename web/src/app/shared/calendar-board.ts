import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, effect, inject, input, output, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, CalendarEvent } from '../core/api.service';
import { DayCell, addDays, dayCell, monthCells, startOfWeek, toKey, weekCells } from './calendar-math';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAYS_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

@Component({
  selector: 'app-calendar-board',
  imports: [FormsModule],
  template: `
    <div class="cal">
      <div class="cal-toolbar">
        <div class="cal-nav">
          <button type="button" (click)="shift(-1)" aria-label="Previous">‹</button>
          <button type="button" (click)="today()">Today</button>
          <button type="button" (click)="shift(1)" aria-label="Next">›</button>
          <h2>{{ heading() }}</h2>
        </div>
        <div class="cal-modes" role="group" aria-label="Calendar view">
          <button type="button" [class.is-on]="mode() === 'month'" (click)="mode.set('month')">Month</button>
          <button type="button" [class.is-on]="mode() === 'week'" (click)="mode.set('week')">Week</button>
          <button type="button" [class.is-on]="mode() === 'day'" (click)="mode.set('day')">Day</button>
        </div>
      </div>
      @if (mode() === 'day') {
        <div class="cal-agenda">
          <p class="cal-agenda__weekday">{{ weekdayName() }}</p>
          @for (event of shown(anchorKey()); track event.id) {
            <button type="button" class="cal-card" [attr.data-status]="event.status" (click)="openEvent(event)">
              <strong>{{ event.title }}</strong>
              @if (event.notes) { <span>{{ event.notes }}</span> }
            </button>
          }
          <button type="button" class="cal-pad" [disabled]="!editable()" [attr.aria-label]="'Add a date on ' + anchorKey()" (click)="openDay(anchorKey())">
            @if (shown(anchorKey()).length === 0) { Nothing on this date. }
          </button>
        </div>
      } @else {
      <div class="cal-scroll">
        <div class="cal-weekdays">
          @for (name of weekdays; track name) {
            <span>{{ name }}</span>
          }
        </div>
        <div class="cal-grid" [class.cal-grid--week]="mode() === 'week'">
          @for (day of cells(); track day.key) {
            <div class="cal-day" [class.is-outside]="!day.inMonth" [class.is-today]="day.key === todayKey">
              <button type="button" class="cal-date" [disabled]="!editable()" (click)="openDay(day.key)">
                {{ day.date.getDate() }}
              </button>
              @for (event of shown(day.key); track event.id) {
                <button type="button" class="cal-chip" [attr.data-status]="event.status" (click)="openEvent(event)">
                  {{ event.title }}
                </button>
              }
              @if (hiddenCount(day.key) > 0) {
                <button type="button" class="cal-more" (click)="focusDay(day)">+{{ hiddenCount(day.key) }} more</button>
              }
              <button type="button" class="cal-pad" [disabled]="!editable()" [attr.aria-label]="'Add a date on ' + day.key" (click)="openDay(day.key)"></button>
            </div>
          }
        </div>
      </div>
      }
      @if (error()) { <p class="cal-error">{{ error() }}</p> }
    </div>
    <dialog class="cal-dialog" #editor aria-label="Edit date" (close)="error.set('')">
      <form class="cal-editor" (ngSubmit)="save()">
        <p class="eyebrow">{{ draft.id ? 'Edit date' : 'New date' }}</p>
        <label>
          <span>Date</span>
          <input name="eventDate" type="date" required [(ngModel)]="draft.eventDate" [disabled]="!editable()" />
        </label>
        <label>
          <span>Title</span>
          <input name="title" required [(ngModel)]="draft.title" [disabled]="!editable()" />
        </label>
        <label>
          <span>Notes</span>
          <textarea name="notes" rows="4" [(ngModel)]="draft.notes" [disabled]="!editable()"></textarea>
        </label>
        <label>
          <span>Status</span>
          <select name="status" [(ngModel)]="draft.status" [disabled]="!editable()">
            <option value="hold">Hold</option>
            <option value="warm">Warm</option>
            <option value="confirmed">Confirmed</option>
            <option value="done">Done</option>
          </select>
        </label>
        <label class="cal-check">
          <input name="publiclyViewable" type="checkbox" [(ngModel)]="draft.publiclyViewable" [disabled]="!editable()" />
          Publicly viewable
        </label>
        <label>
          <span>RSVP email</span>
          <input name="rsvpEmail" type="email" [(ngModel)]="draft.rsvpEmail" [disabled]="!editable()" />
        </label>
        <label>
          <span>Event page</span>
          <input name="eventUrl" type="url" [(ngModel)]="draft.eventUrl" [disabled]="!editable()" placeholder="https://" />
        </label>
        @if (editable()) {
          <label>
            <span>Flyer</span>
            <input name="flyer" type="file" accept="image/jpeg,image/png,image/webp" (change)="chooseFlyer($event)" />
          </label>
          @if (draft.flyerSrc) { <p class="cal-note">A flyer is already on this date. A new file replaces it.</p> }
        }
        @if (error()) { <p class="cal-error">{{ error() }}</p> }
        <div class="cal-actions">
          @if (editable()) {
            <button class="btn btn--primary" type="submit">Save</button>
            @if (draft.id) {
              <button class="btn btn--ghost" type="button" (click)="remove()">Delete</button>
            }
          }
          <button class="btn btn--ghost" type="button" (click)="close()">Close</button>
        </div>
      </form>
    </dialog>
  `,
  styleUrl: './calendar-board.css',
})
export class CalendarBoard {
  readonly editable = input(false);
  readonly sessionEnded = output<void>();
  readonly mode = signal<'month' | 'week' | 'day'>('month');
  readonly anchor = signal(new Date());
  readonly events = signal<CalendarEvent[]>([]);
  readonly error = signal('');
  readonly weekdays = WEEKDAYS;
  readonly todayKey = toKey(new Date());
  draft: CalendarEvent = blank();
  private flyer: File | null = null;

  private readonly api = inject(ApiService);
  private readonly editor = viewChild.required<ElementRef<HTMLDialogElement>>('editor');

  constructor() {
    effect(() => this.load(this.editable()));
  }

  heading() {
    const anchor = this.anchor();
    if (this.mode() === 'day') {
      return `${WEEKDAYS_LONG[anchor.getDay()]}, ${MONTHS_LONG[anchor.getMonth()]} ${anchor.getDate()}, ${anchor.getFullYear()}`;
    }
    if (this.mode() === 'week') {
      const start = startOfWeek(anchor);
      const end = addDays(start, 6);
      const sameMonth = start.getMonth() === end.getMonth();
      const startLabel = formatDay(start, false);
      const endLabel = formatDay(end, true, !sameMonth);
      return `${startLabel} – ${endLabel}`;
    }
    return `${MONTHS_LONG[anchor.getMonth()]} ${anchor.getFullYear()}`;
  }

  weekdayName() {
    return WEEKDAYS_LONG[this.anchor().getDay()];
  }

  anchorKey() {
    return dayCell(this.anchor()).key;
  }

  cells(): DayCell[] {
    return this.mode() === 'week' ? weekCells(this.anchor()) : monthCells(this.anchor());
  }

  shown(key: string) {
    const rows = this.on(key);
    return this.mode() === 'month' ? rows.slice(0, 3) : rows;
  }

  hiddenCount(key: string) {
    if (this.mode() !== 'month') return 0;
    return Math.max(0, this.on(key).length - 3);
  }

  shift(direction: number) {
    const anchor = this.anchor();
    if (this.mode() === 'day') {
      this.anchor.set(addDays(anchor, direction));
      return;
    }
    if (this.mode() === 'week') {
      this.anchor.set(addDays(anchor, direction * 7));
      return;
    }
    this.anchor.set(new Date(anchor.getFullYear(), anchor.getMonth() + direction, 1));
  }

  today() {
    this.anchor.set(new Date());
  }

  focusDay(day: DayCell) {
    this.anchor.set(day.date);
    this.mode.set('day');
  }

  openDay(key: string) {
    if (!this.editable()) return;
    this.error.set('');
    this.flyer = null;
    this.draft = blank(key);
    this.editor().nativeElement.showModal();
  }

  openEvent(event: CalendarEvent) {
    this.error.set('');
    this.flyer = null;
    this.draft = { ...event, notes: event.notes ?? '', rsvpEmail: event.rsvpEmail ?? '', eventUrl: event.eventUrl ?? '' };
    this.editor().nativeElement.showModal();
  }

  chooseFlyer(event: Event) {
    const input = event.target as HTMLInputElement;
    this.flyer = input.files?.[0] ?? null;
  }

  close() {
    this.editor().nativeElement.close();
  }

  save() {
    if (!this.draft.eventDate || !this.draft.title.trim()) {
      this.error.set('Date and title are required.');
      return;
    }
    this.api.saveEvent(this.draft).subscribe({
      next: (saved) => {
        const file = this.flyer;
        if (!file || !saved.id) {
          this.saved();
          return;
        }
        this.api.uploadFlyer(saved.id, file).subscribe({
          next: () => this.saved(),
          error: () => this.error.set('The date saved, but the flyer did not.'),
        });
      },
      error: () => this.error.set('Could not save this date.'),
    });
  }

  private saved() {
    this.error.set('');
    this.flyer = null;
    this.close();
    this.reload();
  }

  remove() {
    const id = this.draft.id;
    if (!id) return;
    this.api.deleteEvent(id).subscribe({
      next: () => {
        this.close();
        this.reload();
      },
      error: () => this.error.set('Could not delete this date.'),
    });
  }

  private on(key: string) {
    return this.events().filter((event) => event.eventDate === key);
  }

  private reload() {
    this.load(this.editable());
  }

  private load(desk: boolean) {
    const request = desk ? this.api.events() : this.api.publicEvents();
    request.subscribe({
      next: (rows) => {
        this.events.set(rows);
        this.error.set('');
      },
      error: (err: HttpErrorResponse) => {
        if (desk && err.status === 401) {
          if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem('ashliee_token');
          this.sessionEnded.emit();
          return;
        }
        this.error.set('Could not load the calendar.');
      },
    });
  }
}

function blank(eventDate = ''): CalendarEvent {
  return { eventDate, title: '', notes: '', status: 'hold', publiclyViewable: false, rsvpEmail: '', eventUrl: '' };
}

function formatDay(date: Date, withYear: boolean, withMonth = true) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = withMonth ? `${months[date.getMonth()]} ${date.getDate()}` : String(date.getDate());
  return withYear ? `${day}, ${date.getFullYear()}` : day;
}
