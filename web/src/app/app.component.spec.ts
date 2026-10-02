import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { routes } from './app.routes';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('creates the shell', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance.title).toBe('Ashliee Moore');
  });

  it('links the book call to action', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const link = fixture.nativeElement.querySelector('a.nav-cta') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toContain('book');
  });
});
