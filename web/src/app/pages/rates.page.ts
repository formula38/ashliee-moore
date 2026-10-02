import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, RateItem } from '../core/api.service';

@Component({
  selector: 'app-rates',
  imports: [FormsModule],
  template: `
    <section class="section">
      <h1>Rate card</h1>
      <form (ngSubmit)="add()">
        <input name="lane" [(ngModel)]="draft.lane" />
        <input name="service" placeholder="Service" [(ngModel)]="draft.service" required />
        <input name="rate" placeholder="Rate" [(ngModel)]="draft.rate" required />
        <button class="btn" type="submit">Add</button>
      </form>
      <ul>
        @for (row of rates(); track row.id) {
          <li>{{ row.lane }} — {{ row.service }} — {{ row.rate }}</li>
        }
      </ul>
    </section>
  `,
})
export class RatesPage implements OnInit {
  private readonly api = inject(ApiService);
  readonly rates = signal<RateItem[]>([]);
  draft: RateItem = { lane: 'modeling', service: '', rate: '' };

  ngOnInit() {
    this.api.rates().subscribe((rows) => this.rates.set(rows));
  }

  add() {
    this.api.saveRate(this.draft).subscribe((saved) => {
      this.rates.update((rows) => [...rows, saved]);
      this.draft = { lane: 'modeling', service: '', rate: '' };
    });
  }
}
