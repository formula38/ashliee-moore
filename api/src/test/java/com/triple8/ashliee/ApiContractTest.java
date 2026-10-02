package com.triple8.ashliee;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class ApiContractTest {
    @Autowired MockMvc mvc;

    @Test
    void unversionedPathIsNotTheContract() throws Exception {
        mvc.perform(get("/api/looks")).andExpect(status().isNotFound());
    }

    @Test
    void inquiryPersists() throws Exception {
        mvc.perform(post("/api/v1/inquiries")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"Ada","email":"ada@example.com","inquiryType":"Modeling","eventDate":"Oct 18","location":"Sacramento","message":"Book the runway"}
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNumber());
    }

    @Test
    void adminRoutesRejectAnonymous() throws Exception {
        mvc.perform(get("/api/v1/admin/leads")).andExpect(status().isUnauthorized());
    }

    @Test
    void leadRoundTripAndPrivateEventHidden() throws Exception {
        String token = mvc.perform(post("/api/v1/admin/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"admin\",\"password\":\"change-me\"}"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        String jwt = token.replaceAll(".*\"token\"\\s*:\\s*\"([^\"]+)\".*", "$1");

        mvc.perform(post("/api/v1/admin/leads")
                        .header("Authorization", "Bearer " + jwt)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Refresh lead\",\"lane\":\"modeling\",\"status\":\"warm\"}"))
                .andExpect(status().isCreated());
        mvc.perform(get("/api/v1/admin/leads").header("Authorization", "Bearer " + jwt))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.name=='Refresh lead')]").exists());

        String created = mvc.perform(post("/api/v1/admin/events")
                        .header("Authorization", "Bearer " + jwt)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"eventDate\":\"2026-11-01\",\"title\":\"Private hold\",\"status\":\"hold\",\"publiclyViewable\":false}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        String id = created.replaceAll(".*\"id\"\\s*:\\s*(\\d+).*", "$1");
        mvc.perform(get("/api/v1/events/" + id)).andExpect(status().isNotFound());
        mvc.perform(get("/api/v1/events")).andExpect(jsonPath("$[?(@.title=='Private hold')]").doesNotExist());

        mvc.perform(patch("/api/v1/admin/events/" + id)
                        .header("Authorization", "Bearer " + jwt)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"publiclyViewable\":true}"))
                .andExpect(status().isOk());
        mvc.perform(get("/api/v1/events")).andExpect(jsonPath("$[?(@.title=='Private hold')]").exists());
    }
}
