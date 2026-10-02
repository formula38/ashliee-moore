import { Component, OnInit, inject, signal } from '@angular/core';
import { ApiService, InquiryPayload } from '../core/api.service';

@Component({
  selector: 'app-inquiries',
  template: `
    <section class="section">
      <h1>Inquiries</h1>
      <ul>
        @for (row of rows(); track row.email) {
          <li>{{ row.name }} — {{ row.inquiryType }} — {{ row.email }}</li>
        }
      </ul>
    </section>
  `,
})
export class InquiriesPage implements OnInit {
  private readonly api = inject(ApiService);
  readonly rows = signal<InquiryPayload[]>([]);

  ngOnInit() {
    this.api.inquiries().subscribe((rows) => this.rows.set(rows));
  }
}
