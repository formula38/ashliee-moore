import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CalendarBoard } from '../shared/calendar-board';

@Component({
  selector: 'app-calendar',
  imports: [CalendarBoard, RouterLink],
  template: `
    <section class="section spread section--calendar">
      <div class="section__intro">
        <p class="eyebrow">Calendar</p>
        <h1>{{ editable() ? 'Desk calendar' : 'Public dates' }}</h1>
        <p>
          @if (editable()) {
            Month, week, or day. Click a day to add a date, or a chip to edit it.
          } @else {
            Only events marked publicly viewable appear here. Holds stay on the desk.
          }
        </p>
        @if (!editable()) {
          <a class="text-link" routerLink="/admin/login" [queryParams]="{ next: '/calendar' }">Sign in to edit</a>
        }
      </div>
      <app-calendar-board [editable]="editable()" (sessionEnded)="signedOut()" />
      <a class="text-link" routerLink="/book">Book</a>
    </section>
  `,
})
export class CalendarPage {
  readonly editable = signal(hasDeskToken());

  signedOut() {
    this.editable.set(false);
  }
}

function hasDeskToken() {
  return typeof sessionStorage !== 'undefined' && !!sessionStorage.getItem('ashliee_token');
}
