import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../core/api.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  template: `
    <section class="section">
      <h1>Desk login</h1>
      <form class="desk-login" (ngSubmit)="submit()">
        <label>
          <span>Username</span>
          <input name="username" [(ngModel)]="username" autocomplete="username" />
        </label>
        <label>
          <span>Password</span>
          <input name="password" type="password" [(ngModel)]="password" autocomplete="current-password" />
        </label>
        <button class="btn btn--primary" type="submit">Sign in</button>
        @if (error()) { <p class="desk-login__error">{{ error() }}</p> }
      </form>
    </section>
  `,
})
export class LoginPage {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly nextUrl = safeNext(inject(ActivatedRoute).snapshot.queryParamMap.get('next'));
  username = 'admin';
  password = '';
  readonly error = signal('');

  submit() {
    this.api.login(this.username, this.password).subscribe({
      next: (body) => {
        sessionStorage.setItem('ashliee_token', body.token);
        this.router.navigateByUrl(this.nextUrl);
      },
      error: () => this.error.set('Sign-in failed.'),
    });
  }
}

function safeNext(next: string | null) {
  if (next && next.startsWith('/') && !next.startsWith('//')) return next;
  return '/admin/leads';
}
