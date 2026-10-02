INSERT INTO look (section, src, alt, caption, sort_order)
SELECT v.section, v.src, v.alt, v.caption, v.sort_order::int
FROM (VALUES
('scene', '/media/library/events/007.jpg', 'Ashliee seated in a white slip dress and black sunglasses in a leather chair under a tent at Dîner en Blanc Sacramento.', 'White chair', 20),
('scene', '/media/library/events/008.jpg', 'Ashliee in a white slit dress and sunglasses poses inside a Vogue Dîner en Blanc Sacramento cover frame.', 'Cover stand', 21),
('scene', '/media/library/events/009.jpg', 'Close portrait of Ashliee in a white dress and cat-eye sunglasses, one hand at her temple.', 'Cat-eye', 22),
('scene', '/media/library/events/011.jpg', 'Ashliee in a white gown stands at a cigar display under the Dîner en Blanc tent.', 'Cigar table', 23),
('scene', '/media/library/events/012.jpg', 'Ashliee laughs in a white gown while holding a cigar beside a barrel display.', 'Cigar pour', 24),
('scene', '/media/library/events/013.jpg', 'Ashliee and three guests in white pose on a Vogue Dîner en Blanc Sacramento cover.', 'Table of four', 25),
('scene', '/media/library/events/014.jpg', 'Ashliee stands centered on the Vogue Dîner en Blanc cover in a white slit dress.', 'Belle Époque', 26),
('scene', '/media/library/events/015.jpg', 'Four women in white pose on an illuminated Vogue Dîner en Blanc cover at dusk.', 'Cover night', 27),
('scene', '/media/library/events/016.jpg', 'Full-length portrait of Ashliee seated in a white gown, sunglasses, and strappy heels.', 'White gown', 28),
('scene', '/media/library/events/010.jpg', 'Dîner en Blanc Sacramento guests dressed in white fill the lawn for the tenth year.', 'Tenth year', 29)
) AS v(section, src, alt, caption, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM look WHERE look.src = v.src);
