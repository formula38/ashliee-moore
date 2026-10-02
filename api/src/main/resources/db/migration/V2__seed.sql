INSERT INTO look (section, src, alt, caption, sort_order) VALUES
('hero', '/media/hero.jpg', 'Ashliee Moore in a rose-framed portrait', 'Look 01 — Roses', 1),
('hero', '/media/fashion-06.jpg', 'Ashliee Moore in a chartreuse look', 'Look 02 — Chartreuse', 2),
('hero', '/media/fashion-04.jpg', 'Ashliee Moore in a crimson look', 'Look 03 — Crimson', 3),
('runway', '/media/runway-01.jpg', 'Runway still of Ashliee Moore', 'Runway 01', 1),
('runway', '/media/runway-02.jpg', 'Runway still of Ashliee Moore', 'Runway 02', 2),
('runway', '/media/runway-03.jpg', 'Runway still of Ashliee Moore', 'Runway 03', 3),
('runway', '/media/runway-04.jpg', 'Runway still of Ashliee Moore', 'Runway 04', 4),
('glam', '/media/glam-01.jpg', 'Beauty close-up of Ashliee Moore', 'Glam 01', 1),
('glam', '/media/glam-02.jpg', 'Beauty close-up of Ashliee Moore', 'Glam 02', 2),
('glam', '/media/glam-03.jpg', 'Beauty close-up of Ashliee Moore', 'Glam 03', 3),
('kitchen', '/media/kitchen-01.jpg', 'Ashliee Moore in the kitchen', 'Kitchen 01', 1),
('kitchen', '/media/kitchen-02.jpg', 'Plated still from the kitchen', 'Kitchen 02', 2),
('kitchen', '/media/kitchen-03.jpg', 'Plated still from the kitchen', 'Kitchen 03', 3),
('scene', '/media/scene-01.jpg', 'Ashliee Moore at an event', 'Scene 01', 1),
('scene', '/media/scene-02.jpg', 'Ashliee Moore at an event', 'Scene 02', 2),
('scene', '/media/scene-05.jpg', 'Ashliee Moore on a rooftop', 'Scene 05', 3),
('about', '/media/about-02.jpg', 'Editorial portrait of Ashliee Moore surrounded by red roses', 'About', 1);

INSERT INTO rate_item (lane, service, rate, notes, sort_order) VALUES
('modeling', 'Runway / fashion show (local)', '$175 / show', 'Fitting same day included; separate fitting $50', 1),
('modeling', 'Appearance / hosting (brand event)', '$250–$400', 'Cash or approved trade', 2),
('modeling', 'Invite-table host', 'Trade / $0 seat', 'Guest tickets billed to guests', 3),
('cosmetology', 'Soft glam (event / shoot)', '$95', '60–90 min', 4),
('culinary', 'Private dinner (plated)', '$250 + groceries', '4–8 guests', 5);

INSERT INTO lead (name, lane, source, contact, status, next_action, next_action_date, fee_or_trade, notes) VALUES
('Lucid Winery fashion show', 'modeling', 'Ashliee project activity', '', 'hold', 'Confirm call time and designer contacts', '2026-10-02', 'runway rate TBD', 'Show 2026-10-09. Lucid Winery downtown R Street.'),
('Florin Square Mall fashion show', 'modeling', 'Ashliee project activity', '', 'hold', 'Name the two designers besides Exquisite U and Mario B', '2026-10-03', 'runway rate TBD', 'Show 2026-10-10.');

INSERT INTO calendar_event (event_date, title, notes, status, is_public) VALUES
('2026-09-19', 'Dîner en Blanc Sacramento — table of 4', 'Capital, downtown Sacramento. Private ops notes.', 'done', FALSE),
('2026-10-09', 'Fashion show — Lucid Winery, R Street', 'Exquisite U, Libush.', 'hold', FALSE),
('2026-10-10', 'Fashion show — Florin Square Mall', 'Community event. Exquisite U, Mario B, plus two designers.', 'hold', FALSE);
