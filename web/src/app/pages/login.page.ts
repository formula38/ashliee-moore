import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../core/api.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  template: `
    <section class="section">
      <h1>Desk login</h1>
      <form (ngSubmit)="submit()">
        <label>Username <input name="username" [(ngModel)]="username" /></label>
        <label>Password <input name="password" type="password" [(ngModel)]="password" /></label>
        <button class="btn" type="submit">Sign in</button>
        @if (error()) { <p>{{ error() }}</p> }
      </form>
    </section>
  `,
})
export class LoginPage {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  username = 'admin';
  password = '';
  readonly error = signal('');

  submit() {
    this.api.login(this.username, this.password).subscribe({
      next: (body) => {
        sessionStorage.setItem('ashliee_token', body.token);
        this.router.navigate(['/admin/leads']);
      },
      error: () => this.error.set('Sign-in failed.'),
    });
  }
}
