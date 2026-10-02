package com.triple8.ashliee.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "calendar_event")
public class CalendarEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "event_date")
    private LocalDate eventDate;
    private String title;
    private String notes;
    private String status;
    @Column(name = "is_public")
    private boolean publiclyViewable;
    @Column(name = "flyer_src")
    private String flyerSrc;
    @Column(name = "rsvp_email")
    private String rsvpEmail;
    @Column(name = "event_url")
    private String eventUrl;

    public Long getId() { return id; }
    public LocalDate getEventDate() { return eventDate; }
    public String getTitle() { return title; }
    public String getNotes() { return notes; }
    public String getStatus() { return status; }
    public boolean isPubliclyViewable() { return publiclyViewable; }
    public String getFlyerSrc() { return flyerSrc; }
    public String getRsvpEmail() { return rsvpEmail; }
    public String getEventUrl() { return eventUrl; }

    public void setEventDate(LocalDate eventDate) { this.eventDate = eventDate; }
    public void setTitle(String title) { this.title = title; }
    public void setNotes(String notes) { this.notes = notes; }
    public void setStatus(String status) { this.status = status; }
    public void setPubliclyViewable(boolean publiclyViewable) { this.publiclyViewable = publiclyViewable; }
    public void setFlyerSrc(String flyerSrc) { this.flyerSrc = flyerSrc; }
    public void setRsvpEmail(String rsvpEmail) { this.rsvpEmail = rsvpEmail; }
    public void setEventUrl(String eventUrl) { this.eventUrl = eventUrl; }
}
