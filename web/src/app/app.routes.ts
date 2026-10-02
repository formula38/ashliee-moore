import { Routes } from '@angular/router';
import { adminGuard } from './core/admin.guard';
import { SEO } from './core/page-meta';
import { HomePage } from './pages/home.page';
import { RunwayPage } from './pages/runway.page';
import { GlamPage } from './pages/glam.page';
import { KitchenPage } from './pages/kitchen.page';
import { ScenePage } from './pages/scene.page';
import { AboutPage } from './pages/about.page';
import { BookPage } from './pages/book.page';
import { CalendarPage } from './pages/calendar.page';
import { NewsletterPage } from './pages/newsletter.page';
import { EventsPage } from './pages/events.page';
import { EventPage } from './pages/event.page';
import { LegalPage } from './pages/legal.page';
import { NotFoundPage } from './pages/not-found.page';
import { LoginPage } from './pages/login.page';
import { LeadsPage } from './pages/leads.page';
import { AdminCalendarPage } from './pages/admin-calendar.page';
import { RatesPage } from './pages/rates.page';
import { InquiriesPage } from './pages/inquiries.page';

const quiet = { title: 'Desk — Ashliee Moore', description: 'Private desk.', path: '', index: false };

export const routes: Routes = [
  { path: '', component: HomePage, data: { seo: SEO.home } },
  { path: 'runway', component: RunwayPage, data: { seo: SEO.runway } },
  { path: 'glam', component: GlamPage, data: { seo: SEO.glam } },
  { path: 'kitchen', component: KitchenPage, data: { seo: SEO.kitchen } },
  { path: 'scene', component: ScenePage, data: { seo: SEO.scene } },
  { path: 'about', component: AboutPage, data: { seo: SEO.about } },
  { path: 'book', component: BookPage, data: { seo: SEO.book } },
  { path: 'calendar', component: CalendarPage, data: { seo: SEO.calendar } },
  { path: 'newsletter', component: NewsletterPage, data: { seo: SEO.newsletter } },
  { path: 'events', component: EventsPage, data: { seo: SEO.events } },
  { path: 'events/:id', component: EventPage, data: { seo: SEO.event } },
  { path: 'privacy', component: LegalPage, data: { doc: 'privacy', seo: SEO.privacy } },
  { path: 'terms', component: LegalPage, data: { doc: 'terms', seo: SEO.terms } },
  { path: 'faq', component: LegalPage, data: { doc: 'faq', seo: SEO.faq } },
  { path: 'admin/login', component: LoginPage, data: { seo: quiet } },
  { path: 'admin/inquiries', component: InquiriesPage, canActivate: [adminGuard], data: { seo: quiet } },
  { path: 'admin/leads', component: LeadsPage, canActivate: [adminGuard], data: { seo: quiet } },
  { path: 'admin/calendar', component: AdminCalendarPage, canActivate: [adminGuard], data: { seo: quiet } },
  { path: 'admin/rates', component: RatesPage, canActivate: [adminGuard], data: { seo: quiet } },
  { path: '**', component: NotFoundPage, data: { seo: SEO.missing } },
];
