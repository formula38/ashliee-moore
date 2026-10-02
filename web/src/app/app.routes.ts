import { Routes } from '@angular/router';
import { adminGuard } from './core/admin.guard';
import { HomePage } from './pages/home.page';
import { RunwayPage } from './pages/runway.page';
import { GlamPage } from './pages/glam.page';
import { KitchenPage } from './pages/kitchen.page';
import { ScenePage } from './pages/scene.page';
import { AboutPage } from './pages/about.page';
import { BookPage } from './pages/book.page';
import { CalendarPage } from './pages/calendar.page';
import { LegalPage } from './pages/legal.page';
import { NotFoundPage } from './pages/not-found.page';
import { LoginPage } from './pages/login.page';
import { LeadsPage } from './pages/leads.page';
import { AdminCalendarPage } from './pages/admin-calendar.page';
import { RatesPage } from './pages/rates.page';
import { InquiriesPage } from './pages/inquiries.page';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'runway', component: RunwayPage },
  { path: 'glam', component: GlamPage },
  { path: 'kitchen', component: KitchenPage },
  { path: 'scene', component: ScenePage },
  { path: 'about', component: AboutPage },
  { path: 'book', component: BookPage },
  { path: 'calendar', component: CalendarPage },
  { path: 'privacy', component: LegalPage, data: { doc: 'privacy' } },
  { path: 'terms', component: LegalPage, data: { doc: 'terms' } },
  { path: 'faq', component: LegalPage, data: { doc: 'faq' } },
  { path: 'admin/login', component: LoginPage },
  { path: 'admin/inquiries', component: InquiriesPage, canActivate: [adminGuard] },
  { path: 'admin/leads', component: LeadsPage, canActivate: [adminGuard] },
  { path: 'admin/calendar', component: AdminCalendarPage, canActivate: [adminGuard] },
  { path: 'admin/rates', component: RatesPage, canActivate: [adminGuard] },
  { path: '**', component: NotFoundPage },
];
