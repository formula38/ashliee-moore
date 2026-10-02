import { Component, ElementRef, HostListener, effect, inject, viewChild } from '@angular/core';
import { NavigationStart, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { PageMeta } from './core/page-meta';
import { Zoom } from './core/zoom';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  readonly title = 'Ashliee Moore';
  readonly year = new Date().getFullYear();
  readonly zoom = inject(Zoom);
  private readonly meta = inject(PageMeta);
  scrolled = false;
  navOpen = false;
  private readonly zoomBox = viewChild<ElementRef<HTMLDialogElement>>('zoomBox');

  constructor() {
    inject(Router).events.pipe(filter((event) => event instanceof NavigationStart)).subscribe(() => {
      this.zoom.clear();
      this.closeNav();
    });
    effect(() => {
      const shot = this.zoom.shot();
      const dialog = this.zoomBox()?.nativeElement;
      if (!dialog) return;
      if (shot && !dialog.open) dialog.showModal();
      if (!shot && dialog.open) dialog.close();
    });
  }

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled = window.scrollY > 24;
  }

  @HostListener('window:keydown', ['$event'])
  onKey(event: KeyboardEvent) {
    if (event.key === 'Escape') this.closeNav();
  }

  toggleNav() {
    this.navOpen = !this.navOpen;
    document.body.style.overflow = this.navOpen ? 'hidden' : '';
  }

  closeNav() {
    this.navOpen = false;
    if (typeof document !== 'undefined') document.body.style.overflow = '';
  }

  closeZoom() {
    this.zoomBox()?.nativeElement.close();
  }

  backdrop(event: Event) {
    if (event.target === this.zoomBox()?.nativeElement) this.closeZoom();
  }
}
