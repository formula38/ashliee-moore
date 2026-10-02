import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

export const API = '/api/v1';

export interface Look {
  id: number;
  section: string;
  src: string;
  alt: string;
  caption: string;
}

export interface InquiryPayload {
  name: string;
  email: string;
  phone?: string;
  inquiryType: string;
  eventDate: string;
  location: string;
  socialPlatform?: string;
  social?: string;
  message: string;
  gotcha?: string;
}

export interface Lead {
  id?: number;
  name: string;
  lane: string;
  status: string;
  source?: string;
  contact?: string;
  nextAction?: string;
  nextActionDate?: string;
  feeOrTrade?: string;
  notes?: string;
}

export interface CalendarEvent {
  id?: number;
  eventDate: string;
  title: string;
  notes?: string;
  status: string;
  publiclyViewable: boolean;
  flyerSrc?: string;
  rsvpEmail?: string;
  eventUrl?: string;
}

export interface RateItem {
  id?: number;
  lane: string;
  service: string;
  rate: string;
  notes?: string;
  sortOrder?: number;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  looks(section?: string) {
    const params = section ? { section } : undefined;
    return this.http.get<Look[]>(`${API}/looks`, { params });
  }

  publicEvents() {
    return this.http.get<CalendarEvent[]>(`${API}/events`);
  }

  publicEvent(id: number) {
    return this.http.get<CalendarEvent>(`${API}/events/${id}`);
  }

  inquire(body: InquiryPayload) {
    return this.http.post<{ id: number }>(`${API}/inquiries`, body);
  }

  login(username: string, password: string) {
    return this.http.post<{ token: string }>(`${API}/admin/login`, { username, password });
  }

  leads() {
    return this.http.get<Lead[]>(`${API}/admin/leads`);
  }

  saveLead(body: Lead) {
    return body.id
      ? this.http.patch<Lead>(`${API}/admin/leads/${body.id}`, body)
      : this.http.post<Lead>(`${API}/admin/leads`, body);
  }

  events() {
    return this.http.get<CalendarEvent[]>(`${API}/admin/events`);
  }

  saveEvent(body: CalendarEvent) {
    return body.id
      ? this.http.patch<CalendarEvent>(`${API}/admin/events/${body.id}`, body)
      : this.http.post<CalendarEvent>(`${API}/admin/events`, body);
  }

  deleteEvent(id: number) {
    return this.http.delete<void>(`${API}/admin/events/${id}`);
  }

  uploadFlyer(id: number, file: File) {
    const body = new FormData();
    body.append('file', file);
    return this.http.post<CalendarEvent>(`${API}/admin/events/${id}/flyer`, body);
  }

  rates() {
    return this.http.get<RateItem[]>(`${API}/admin/rates`);
  }

  saveRate(body: RateItem) {
    return body.id
      ? this.http.patch<RateItem>(`${API}/admin/rates/${body.id}`, body)
      : this.http.post<RateItem>(`${API}/admin/rates`, body);
  }

  inquiries() {
    return this.http.get<InquiryPayload[]>(`${API}/admin/inquiries`);
  }
}
