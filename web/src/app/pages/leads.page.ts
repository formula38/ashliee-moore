import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, Lead } from '../core/api.service';

@Component({
  selector: 'app-leads',
  imports: [FormsModule],
  template: `
    <section class="section">
      <h1>Leads</h1>
      <form (ngSubmit)="add()">
        <input name="name" placeholder="Name" [(ngModel)]="draft.name" required />
        <input name="lane" placeholder="Lane" [(ngModel)]="draft.lane" />
        <button class="btn" type="submit">Add lead</button>
      </form>
      <ul>
        @for (lead of leads(); track lead.id) {
          <li>{{ lead.name }} — {{ lead.status }} — {{ lead.nextAction }}</li>
        }
      </ul>
    </section>
  `,
})
export class LeadsPage implements OnInit {
  private readonly api = inject(ApiService);
  readonly leads = signal<Lead[]>([]);
  draft: Lead = { name: '', lane: 'modeling', status: 'warm' };

  ngOnInit() {
    this.reload();
  }

  reload() {
    this.api.leads().subscribe((rows) => this.leads.set(rows));
  }

  add() {
    this.api.saveLead(this.draft).subscribe(() => {
      this.draft = { name: '', lane: 'modeling', status: 'warm' };
      this.reload();
    });
  }
}
