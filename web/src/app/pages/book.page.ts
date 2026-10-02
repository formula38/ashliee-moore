import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, InquiryPayload } from '../core/api.service';
import { Reveal } from '../shared/reveal';

@Component({
  selector: 'app-book',
  imports: [FormsModule, Reveal],
  template: `
    <section class="section section--book" appReveal>
      <div class="book">
        <div class="book__intro">
          <p class="eyebrow">Book</p>
          <h1>Let’s build the next look, plate, or night.</h1>
          <p>Modeling, culinary hosting, or event promotion — tell Ashliee what you need.</p>
        </div>
        <form class="book__form" (ngSubmit)="submit()">
          <label class="hp">
            Company
            <input name="gotcha" tabindex="-1" autocomplete="off" [(ngModel)]="form.gotcha" />
          </label>
          <label>
            <span>Name</span>
            <input name="name" autocomplete="name" required [(ngModel)]="form.name" />
          </label>
          <div class="book__pair">
            <label>
              <span>Email</span>
              <input name="email" type="email" autocomplete="email" required [(ngModel)]="form.email" />
            </label>
            <label>
              <span>Phone <span class="book__optional">optional</span></span>
              <input name="phone" type="tel" autocomplete="tel" placeholder="(555) 555-5555" [(ngModel)]="form.phone" />
            </label>
          </div>
          <label>
            <span>Inquiry type</span>
            <select name="inquiryType" required [(ngModel)]="form.inquiryType">
              <option value="Modeling">Modeling</option>
              <option value="Culinary">Culinary</option>
              <option value="Event promotion">Event promotion</option>
            </select>
          </label>
          <div class="book__pair">
            <label>
              <span>Date</span>
              <input name="eventDate" autocomplete="off" required placeholder="e.g. Oct 18, 2026" [(ngModel)]="form.eventDate" />
            </label>
            <label>
              <span>Location</span>
              <input name="location" autocomplete="off" required placeholder="City, venue, or TBD" [(ngModel)]="form.location" />
            </label>
          </div>
          <div class="book__pair">
            <label>
              <span>Social <span class="book__optional">optional</span></span>
              <select name="socialPlatform" [(ngModel)]="form.socialPlatform">
                <option value="">Select one</option>
                <option value="Instagram">Instagram</option>
                <option value="TikTok">TikTok</option>
                <option value="Facebook">Facebook</option>
                <option value="YouTube">YouTube</option>
                <option value="Other">Other</option>
              </select>
            </label>
            <label>
              <span>Social link <span class="book__optional">optional</span></span>
              <input name="social" inputmode="url" autocomplete="url" placeholder="https:// or &#64;handle" [(ngModel)]="form.social" />
            </label>
          </div>
          <label class="book__message">
            <span>Message</span>
            <textarea name="message" rows="5" required placeholder="What you’re looking for…" [(ngModel)]="form.message"></textarea>
          </label>
          <button class="btn btn--primary" type="submit" [disabled]="sending()">Send inquiry</button>
          <p class="book__status" role="status" aria-live="polite" [attr.data-state]="statusState()">{{ status() }}</p>
          <p class="book__note">Saved on the desk. We reply by email.</p>
        </form>
      </div>
    </section>
  `,
})
export class BookPage {
  private readonly api = inject(ApiService);
  readonly sending = signal(false);
  readonly status = signal('');
  readonly statusState = signal('');
  form: InquiryPayload = {
    name: '',
    email: '',
    phone: '',
    inquiryType: 'Modeling',
    eventDate: '',
    location: '',
    socialPlatform: '',
    social: '',
    message: '',
    gotcha: '',
  };

  submit() {
    if (!this.form.name || !this.form.email || !this.form.message) {
      this.status.set('Name, email, and message are required.');
      this.statusState.set('err');
      return;
    }
    this.sending.set(true);
    this.status.set('Sending…');
    this.statusState.set('pending');
    this.api.inquire(this.form).subscribe({
      next: () => {
        this.form = { ...this.form, name: '', email: '', phone: '', eventDate: '', location: '', social: '', message: '', gotcha: '' };
        this.status.set('Inquiry sent. Ashliee will get back to you.');
        this.statusState.set('ok');
        this.sending.set(false);
      },
      error: () => {
        this.status.set('Could not save the inquiry. Try again.');
        this.statusState.set('err');
        this.sending.set(false);
      },
    });
  }
}
