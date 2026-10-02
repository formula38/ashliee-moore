package com.triple8.ashliee.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "lead")
public class Lead {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String lane;
    private String source;
    private String contact;
    private String status;
    @Column(name = "next_action")
    private String nextAction;
    @Column(name = "next_action_date")
    private LocalDate nextActionDate;
    @Column(name = "fee_or_trade")
    private String feeOrTrade;
    private String notes;
    @Column(name = "created_at")
    private Instant createdAt = Instant.now();

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getLane() { return lane; }
    public String getSource() { return source; }
    public String getContact() { return contact; }
    public String getStatus() { return status; }
    public String getNextAction() { return nextAction; }
    public LocalDate getNextActionDate() { return nextActionDate; }
    public String getFeeOrTrade() { return feeOrTrade; }
    public String getNotes() { return notes; }

    public void setName(String name) { this.name = name; }
    public void setLane(String lane) { this.lane = lane; }
    public void setSource(String source) { this.source = source; }
    public void setContact(String contact) { this.contact = contact; }
    public void setStatus(String status) { this.status = status; }
    public void setNextAction(String nextAction) { this.nextAction = nextAction; }
    public void setNextActionDate(LocalDate nextActionDate) { this.nextActionDate = nextActionDate; }
    public void setFeeOrTrade(String feeOrTrade) { this.feeOrTrade = feeOrTrade; }
    public void setNotes(String notes) { this.notes = notes; }
}
