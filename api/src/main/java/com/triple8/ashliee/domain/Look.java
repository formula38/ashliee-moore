package com.triple8.ashliee.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "look")
public class Look {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String section;
    private String src;
    private String alt;
    private String caption;
    @Column(name = "sort_order")
    private int sortOrder;

    public Long getId() { return id; }
    public String getSection() { return section; }
    public String getSrc() { return src; }
    public String getAlt() { return alt; }
    public String getCaption() { return caption; }
    public int getSortOrder() { return sortOrder; }
}
