import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <section class="section">
      <h1>Page not found</h1>
      <p>That address is not on this site.</p>
      <a routerLink="/">Back home</a>
    </section>
  `,
})
export class NotFoundPage {}
