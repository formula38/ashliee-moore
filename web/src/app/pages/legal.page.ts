import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FAQ } from './legal-copy';

@Component({
  selector: 'app-legal',
  imports: [RouterLink],
  template: `
    <article class="section legal">
      @switch (doc) {
        @case ('privacy') {
          <p class="eyebrow">Privacy</p>
          <h1>How inquiries are kept</h1>
          <p class="legal__updated">October 2026</p>
          <p>
            This notice describes the Ashliee Moore site. Ashliee is based in Sacramento.
            A booking inquiry is stored on her desk so it can be answered.
          </p>

          <h2>What the booking form stores</h2>
          <p>The <a routerLink="/book">booking form</a> saves:</p>
          <ul>
            <li>Name</li>
            <li>Email</li>
            <li>Phone, if you add one</li>
            <li>Inquiry type: modeling, culinary, or event promotion</li>
            <li>Date and location</li>
            <li>Social platform and link, if you add them</li>
            <li>Your message</li>
          </ul>
          <p>Those fields are used to reply and, if the request becomes a job, to remember what was asked.</p>
          <p>A hidden spam field, if it is filled in, is ignored. That submission is not saved.</p>

          <h2>What stays off this site</h2>
          <p>There is no public account and no analytics or advertising pixel.</p>
          <p>
            The <a routerLink="/newsletter">Sacramento Fashion letter</a> is a page.
            It is not an email list, and the site does not ask you to subscribe.
          </p>
          <p>
            RSVP on a public event opens your own mail app, or the host’s event page.
            This site does not store a guest list.
          </p>
          <p>Signing in to the desk keeps a token in that browser session. Public visitors do not receive one.</p>

          <h2>Other sites</h2>
          <p>
            Typefaces load from Google Fonts, so opening a page can reach Google.
            Instagram, and any host event page linked from <a routerLink="/events">Events</a>,
            are other sites with their own rules.
          </p>

          <h2>Who can see an inquiry</h2>
          <p>
            An inquiry is visible on the signed-in desk. It is not sold or rented.
            A host sees only what you send them yourself, such as an RSVP email you choose to send.
          </p>

          <h2>How long, and how to change it</h2>
          <p>
            An inquiry stays while the conversation or the job is still in use.
            To correct or delete one, send another note through the booking form,
            from the same email, and say what should change.
          </p>
          <p>
            If you are in California, you can ask what the desk holds under your email
            and ask for it to be deleted. This site does not sell personal information.
          </p>
        }
        @case ('terms') {
          <p class="eyebrow">Terms</p>
          <h1>A request, then a deal memo</h1>
          <p class="legal__updated">October 2026</p>
          <p>
            These terms cover use of this site and a booking request for Ashliee Moore in Sacramento.
            Sending the form means you have read them.
          </p>

          <h2>The form is a request</h2>
          <p>
            The <a routerLink="/book">booking form</a> is a request.
            The date stays open until a written deal memo is sent.
            Email is enough for that confirmation.
            Fee, hours, travel, wardrobe, and how any photos or video may be used are written there.
            Until that memo, nothing is reserved and nothing is owed.
          </p>

          <h2>What a memo covers</h2>
          <p>
            Modeling, culinary hosting, and event promotion.
            Work away from Sacramento includes travel only when the memo says so.
            Rates are quoted after the inquiry. They are not listed on this site.
            A cancellation fee, if there is one, is the fee written in the memo.
          </p>

          <h2>Photos</h2>
          <p>
            Pictures on this site are Ashliee’s portfolio.
            Photos or video made for a job may be used only in the way the deal memo describes:
            the media, the period, and the place. Further use needs a new written yes.
          </p>

          <h2>Work that is declined</h2>
          <p>
            Over-sexualized, erotic, or sexually graphic concepts, wardrobe, or marketing
            can be declined with no fee. Fashion, beauty, culinary, and event work
            that fits a long-term brand is the lane.
          </p>

          <h2>Public dates</h2>
          <p>
            The calendar, the <a routerLink="/events">events board</a>, and the
            <a routerLink="/newsletter">Sacramento Fashion letter</a> show dates marked publicly viewable.
            An RSVP goes to the email or the host page on that event. This site does not sell tickets.
          </p>

          <h2>The rest of the site</h2>
          <p>
            Pages are offered as they appear. A link to Instagram or a host’s event page leaves this site.
            Questions about a particular job are settled in that job’s deal memo.
            These website terms follow California law.
          </p>
        }
        @default {
          <p class="eyebrow">FAQ</p>
          <h1>Questions before you book</h1>
          @for (item of faq; track item.q) {
            <h2>{{ item.q }}</h2>
            @if (item.q === 'How do I request a date?') {
              <p>Use the <a routerLink="/book">booking form</a>. Include the date, the place, and what you need. A reply comes by email.</p>
            } @else if (item.q === 'Which dates are public?') {
              <p>
                The <a routerLink="/events">events board</a> and the
                <a routerLink="/newsletter">Sacramento Fashion letter</a>
                show only dates marked publicly viewable. Holds and desk notes stay off those pages.
              </p>
            } @else if (item.q === 'Where is Instagram?') {
              <p>Ashliee posts at <a href="https://www.instagram.com/ashliee007/">&#64;ashliee007</a>. Instagram has its own privacy rules.</p>
            } @else {
              <p>{{ item.a }}</p>
            }
          }
        }
      }
    </article>
  `,
})
export class LegalPage {
  readonly doc = inject(ActivatedRoute).snapshot.data['doc'] as string;
  readonly faq = FAQ;
}
