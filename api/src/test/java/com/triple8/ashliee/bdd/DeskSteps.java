package com.triple8.ashliee.bdd;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.cucumber.spring.CucumberContextConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

@CucumberContextConfiguration
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class DeskSteps {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;
    private String token;
    private int status;

    @When("a visitor posts an inquiry for {string} in {string}")
    public void postInquiry(String type, String location) throws Exception {
        MvcResult result = mvc.perform(post("/api/v1/inquiries")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Visitor\",\"email\":\"v@example.com\",\"inquiryType\":\"" + type
                        + "\",\"eventDate\":\"Nov 1\",\"location\":\"" + location + "\",\"message\":\"Hello\"}"))
                .andReturn();
        status = result.getResponse().getStatus();
    }

    @Then("the inquiry is stored")
    public void stored() {
        assertTrue(status == 201);
    }

    @Given("an operator is signed in")
    public void signIn() throws Exception {
        MvcResult result = mvc.perform(post("/api/v1/admin/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"admin\",\"password\":\"change-me\"}")).andReturn();
        token = json.readTree(result.getResponse().getContentAsString()).get("token").asText();
    }

    @When("the operator saves a lead named {string}")
    public void saveLead(String name) throws Exception {
        mvc.perform(post("/api/v1/admin/leads")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"" + name + "\",\"lane\":\"modeling\",\"status\":\"warm\"}"));
    }

    @Then("listing leads includes {string}")
    public void leadsInclude(String name) throws Exception {
        String body = mvc.perform(get("/api/v1/admin/leads").header("Authorization", "Bearer " + token))
                .andReturn().getResponse().getContentAsString();
        assertTrue(body.contains(name));
    }

    @When("the operator saves a private event titled {string}")
    public void savePrivate(String title) throws Exception {
        mvc.perform(post("/api/v1/admin/events")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"eventDate\":\"2026-12-01\",\"title\":\"" + title + "\",\"status\":\"hold\",\"publiclyViewable\":false}"));
    }

    @Then("the public calendar does not list {string}")
    public void publicHides(String title) throws Exception {
        JsonNode rows = json.readTree(mvc.perform(get("/api/v1/events")).andReturn().getResponse().getContentAsString());
        boolean found = false;
        for (JsonNode row : rows) {
            if (title.equals(row.path("title").asText())) found = true;
        }
        assertFalse(found);
    }
}
