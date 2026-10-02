package com.triple8.ashliee.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "inquiry")
public class Inquiry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
    private String phone;
    @Column(name = "inquiry_type")
    private String inquiryType;
    @Column(name = "event_date")
    private String eventDate;
    private String location;
    @Column(name = "social_platform")
    private String socialPlatform;
    private String social;
    private String message;
    @Column(name = "created_at")
    private Instant createdAt = Instant.now();

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getInquiryType() { return inquiryType; }
    public Instant getCreatedAt() { return createdAt; }

    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setInquiryType(String inquiryType) { this.inquiryType = inquiryType; }
    public void setEventDate(String eventDate) { this.eventDate = eventDate; }
    public void setLocation(String location) { this.location = location; }
    public void setSocialPlatform(String socialPlatform) { this.socialPlatform = socialPlatform; }
    public void setSocial(String social) { this.social = social; }
    public void setMessage(String message) { this.message = message; }
}
