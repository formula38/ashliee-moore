UPDATE calendar_event
SET notes = 'Done. White-party networking at Capital, Sacramento downtown. 3 connections. Host seat $0. Raws still due 2026-10-03.',
    status = 'done'
WHERE event_date = DATE '2026-09-19'
  AND title = 'Dîner en Blanc Sacramento — table of 4';

UPDATE calendar_event
SET notes = 'Downtown Sacramento. Designers: Exquisite U, Libush. Confirm call time by 2026-10-02. Wardrobe check 2026-10-08.',
    status = 'hold'
WHERE event_date = DATE '2026-10-09'
  AND title = 'Fashion show — Lucid Winery, R Street';

UPDATE calendar_event
SET notes = 'Community event. Designers: Exquisite U, Mario B, plus two others (names TBD). Confirm call by 2026-10-03.',
    status = 'hold'
WHERE event_date = DATE '2026-10-10'
  AND title = 'Fashion show — Florin Square Mall';

INSERT INTO calendar_event (event_date, title, notes, status, is_public)
SELECT v.event_date, v.title, v.notes, v.status, FALSE
FROM (VALUES
  (DATE '2026-09-24', 'E2 Biz Connect End of Summer Mixer — Wolfe Heights', 'Done. Thu 6–8 PM. Free entry. Wolfe Heights Estates Winery. Follow-up window was through 2026-09-27.', 'done'),
  (DATE '2026-09-29', 'LA Fashion Week audition — virtual call', 'Tue 1:30 PM. Virtual meeting. Prep day was 2026-09-28. Debrief due 2026-09-30.', 'hold'),
  (DATE '2026-09-22', 'Ashliee Moore: RSVP free ticket; decide solo vs +1; print business cards', 'E2 mixer lead. hold · modeling', 'hold'),
  (DATE '2026-09-22', 'Ashliee Moore: Finish DEB social posts if still open; else close', 'DEB social lead. warm · modeling', 'warm'),
  (DATE '2026-09-23', 'Ashliee Moore: E−1 wardrobe + parking/arrive-by plan for Wolfe Heights', 'Mixer prep lead. warm · modeling', 'warm'),
  (DATE '2026-09-27', 'Ashliee Moore: Thank-yous + 1–2 social posts; log 3–5 new contacts into leads', 'Mixer follow-up lead. warm · modeling', 'warm'),
  (DATE '2026-09-28', 'Ashliee Moore: Prep today for Tue 1:30 PM virtual Fashion Week audition', 'Audition prep lead. hold · modeling', 'hold'),
  (DATE '2026-09-30', 'Ashliee Moore: Write what they asked for and the next step after the call', 'Audition debrief lead. warm · modeling', 'warm'),
  (DATE '2026-10-02', 'Ashliee Moore: Confirm call time and designer contacts (Exquisite U Libush)', 'Lucid show lead. hold · modeling', 'hold'),
  (DATE '2026-10-03', 'Ashliee Moore: Post-event: chase photographer raws; archive day-of notes', 'DEB raws lead. confirmed · modeling', 'confirmed'),
  (DATE '2026-10-03', 'Ashliee Moore: Deliver raws/selects ≤14 days post-event', 'DEB photographer lead. warm · modeling', 'warm'),
  (DATE '2026-10-03', 'Ashliee Moore: Confirm call time; name the two designers besides Exquisite U and Mario B', 'Florin show lead. hold · modeling', 'hold')
) AS v(event_date, title, notes, status)
WHERE NOT EXISTS (
  SELECT 1 FROM calendar_event existing
  WHERE existing.event_date = v.event_date AND existing.title = v.title
);
