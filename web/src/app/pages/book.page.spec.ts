import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { BookPage } from './book.page';
import { ApiService } from '../core/api.service';

describe('BookPage', () => {
  it('loads nothing until submit, and posts to /api/v1/inquiries', () => {
    TestBed.configureTestingModule({
      imports: [BookPage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const http = TestBed.inject(HttpTestingController);
    const api = TestBed.inject(ApiService);
    api.looks().subscribe();
    const looks = http.expectOne('/api/v1/looks');
    looks.flush([]);

    const fixture = TestBed.createComponent(BookPage);
    fixture.componentInstance.form = {
      name: 'Ada',
      email: 'ada@example.com',
      inquiryType: 'Modeling',
      eventDate: 'Oct 18',
      location: 'Sacramento',
      message: 'Runway',
    };
    fixture.componentInstance.submit();
    const req = http.expectOne('/api/v1/inquiries');
    expect(req.request.method).toBe('POST');
    req.flush({ id: 1 });
    http.verify();
  });
});
