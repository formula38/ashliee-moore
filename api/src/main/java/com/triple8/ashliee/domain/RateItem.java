package com.triple8.ashliee.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "rate_item")
public class RateItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String lane;
    private String service;
    private String rate;
    private String notes;
    @Column(name = "sort_order")
    private int sortOrder;

    public Long getId() { return id; }
    public String getLane() { return lane; }
    public String getService() { return service; }
    public String getRate() { return rate; }
    public String getNotes() { return notes; }
    public int getSortOrder() { return sortOrder; }

    public void setLane(String lane) { this.lane = lane; }
    public void setService(String service) { this.service = service; }
    public void setRate(String rate) { this.rate = rate; }
    public void setNotes(String notes) { this.notes = notes; }
    public void setSortOrder(int sortOrder) { this.sortOrder = sortOrder; }
}
