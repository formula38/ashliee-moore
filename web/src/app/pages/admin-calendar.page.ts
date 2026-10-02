import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CalendarBoard } from '../shared/calendar-board';

@Component({
  selector: 'app-admin-calendar',
  imports: [CalendarBoard],
  template: `
    <section class="section spread section--calendar">
      <div class="section__intro">
        <p class="eyebrow">Desk</p>
        <h1>Calendar</h1>
        <p>Month, week, or day. Click a day to add a date, or a chip to edit it.</p>
      </div>
      <app-calendar-board [editable]="true" (sessionEnded)="signedOut()" />
    </section>
  `,
})
export class AdminCalendarPage {
  private readonly router = inject(Router);

  signedOut() {
    this.router.navigate(['/admin/login'], { queryParams: { next: '/admin/calendar' } });
  }
}
