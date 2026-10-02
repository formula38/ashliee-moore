CREATE TABLE look (
    id BIGSERIAL PRIMARY KEY,
    section VARCHAR(32) NOT NULL,
    src VARCHAR(400) NOT NULL,
    alt TEXT NOT NULL,
    caption VARCHAR(200) NOT NULL,
    sort_order INT NOT NULL
);
CREATE INDEX look_section_idx ON look (section, sort_order);

CREATE TABLE inquiry (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(320) NOT NULL,
    phone VARCHAR(40),
    inquiry_type VARCHAR(40) NOT NULL,
    event_date VARCHAR(80) NOT NULL,
    location VARCHAR(200) NOT NULL,
    social_platform VARCHAR(40),
    social VARCHAR(400),
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX inquiry_email_idx ON inquiry (email);

CREATE TABLE lead (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    lane VARCHAR(40) NOT NULL,
    source VARCHAR(200),
    contact VARCHAR(400),
    status VARCHAR(40) NOT NULL,
    next_action TEXT,
    next_action_date DATE,
    fee_or_trade VARCHAR(200),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX lead_next_action_date_idx ON lead (next_action_date);

CREATE TABLE calendar_event (
    id BIGSERIAL PRIMARY KEY,
    event_date DATE NOT NULL,
    title VARCHAR(200) NOT NULL,
    notes TEXT,
    status VARCHAR(40) NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE INDEX calendar_event_date_idx ON calendar_event (event_date);
CREATE INDEX calendar_event_public_idx ON calendar_event (is_public, event_date);

CREATE TABLE rate_item (
    id BIGSERIAL PRIMARY KEY,
    lane VARCHAR(40) NOT NULL,
    service VARCHAR(200) NOT NULL,
    rate VARCHAR(80) NOT NULL,
    notes TEXT,
    sort_order INT NOT NULL
);

CREATE TABLE admin_user (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(80) NOT NULL UNIQUE,
    password_hash VARCHAR(120) NOT NULL
);
