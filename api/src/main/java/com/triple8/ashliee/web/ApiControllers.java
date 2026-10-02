package com.triple8.ashliee.web;

import com.triple8.ashliee.domain.CalendarEvent;
import com.triple8.ashliee.domain.Inquiry;
import com.triple8.ashliee.domain.Lead;
import com.triple8.ashliee.domain.Look;
import com.triple8.ashliee.domain.RateItem;
import com.triple8.ashliee.repo.AdminUserRepository;
import com.triple8.ashliee.repo.CalendarEventRepository;
import com.triple8.ashliee.repo.InquiryRepository;
import com.triple8.ashliee.repo.LeadRepository;
import com.triple8.ashliee.repo.LookRepository;
import com.triple8.ashliee.repo.RateItemRepository;
import com.triple8.ashliee.security.JwtService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
class ApiControllers {
    private final LookRepository looks;
    private final InquiryRepository inquiries;
    private final LeadRepository leads;
    private final CalendarEventRepository events;
    private final RateItemRepository rates;
    private final AdminUserRepository admins;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    ApiControllers(LookRepository looks, InquiryRepository inquiries, LeadRepository leads,
                   CalendarEventRepository events, RateItemRepository rates, AdminUserRepository admins,
                   PasswordEncoder encoder, JwtService jwt) {
        this.looks = looks;
        this.inquiries = inquiries;
        this.leads = leads;
        this.events = events;
        this.rates = rates;
        this.admins = admins;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    @GetMapping("/api/v1/looks")
    List<Look> looks(@RequestParam(required = false) String section) {
        if (section == null || section.isBlank()) {
            return looks.findAllByOrderBySectionAscSortOrderAsc();
        }
        return looks.findBySectionOrderBySortOrderAsc(section);
    }

    @GetMapping("/api/v1/events")
    List<CalendarEvent> publicEvents() {
        return events.findByPubliclyViewableTrueOrderByEventDateAsc();
    }

    @GetMapping("/api/v1/events/{id}")
    CalendarEvent publicEvent(@PathVariable long id) {
        return events.findById(id)
                .filter(CalendarEvent::isPubliclyViewable)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/api/v1/inquiries")
    @ResponseStatus(HttpStatus.CREATED)
    Map<String, Long> inquire(@Valid @RequestBody InquiryRequest body) {
        if (body.gotcha() != null && !body.gotcha().isBlank()) {
            return Map.of("id", 0L);
        }
        Inquiry row = new Inquiry();
        row.setName(body.name());
        row.setEmail(body.email());
        row.setPhone(body.phone());
        row.setInquiryType(body.inquiryType());
        row.setEventDate(body.eventDate());
        row.setLocation(body.location());
        row.setSocialPlatform(body.socialPlatform());
        row.setSocial(body.social());
        row.setMessage(body.message());
        return Map.of("id", inquiries.save(row).getId());
    }

    @PostMapping("/api/v1/admin/login")
    Map<String, String> login(@RequestBody LoginRequest body) {
        var user = admins.findByUsername(body.username())
                .filter(found -> encoder.matches(body.password(), found.getPasswordHash()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        return Map.of("token", jwt.issue(user.getUsername()));
    }

    @GetMapping("/api/v1/admin/inquiries")
    List<Inquiry> adminInquiries() { return inquiries.findAll(); }

    @GetMapping("/api/v1/admin/leads")
    List<Lead> adminLeads() { return leads.findAll(); }

    @PostMapping("/api/v1/admin/leads")
    @ResponseStatus(HttpStatus.CREATED)
    Lead createLead(@RequestBody Lead body) { bodySet(body); return leads.save(body); }

    @PatchMapping("/api/v1/admin/leads/{id}")
    Lead patchLead(@PathVariable long id, @RequestBody Lead body) {
        Lead row = leads.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (body.getName() != null) row.setName(body.getName());
        if (body.getLane() != null) row.setLane(body.getLane());
        if (body.getStatus() != null) row.setStatus(body.getStatus());
        if (body.getNextAction() != null) row.setNextAction(body.getNextAction());
        if (body.getNextActionDate() != null) row.setNextActionDate(body.getNextActionDate());
        if (body.getNotes() != null) row.setNotes(body.getNotes());
        if (body.getContact() != null) row.setContact(body.getContact());
        if (body.getFeeOrTrade() != null) row.setFeeOrTrade(body.getFeeOrTrade());
        return leads.save(row);
    }

    @DeleteMapping("/api/v1/admin/leads/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void deleteLead(@PathVariable long id) { leads.deleteById(id); }

    @GetMapping("/api/v1/admin/events")
    List<CalendarEvent> adminEvents() { return events.findAllByOrderByEventDateAsc(); }

    @PostMapping("/api/v1/admin/events")
    @ResponseStatus(HttpStatus.CREATED)
    CalendarEvent createEvent(@RequestBody CalendarEvent body) {
        if (body.getStatus() == null) body.setStatus("hold");
        return events.save(body);
    }

    @PatchMapping("/api/v1/admin/events/{id}")
    CalendarEvent patchEvent(@PathVariable long id, @RequestBody EventPatch body) {
        CalendarEvent row = events.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (body.title() != null) row.setTitle(body.title());
        if (body.notes() != null) row.setNotes(body.notes());
        if (body.status() != null) row.setStatus(body.status());
        if (body.eventDate() != null) row.setEventDate(body.eventDate());
        if (body.publiclyViewable() != null) row.setPubliclyViewable(body.publiclyViewable());
        return events.save(row);
    }

    @DeleteMapping("/api/v1/admin/events/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void deleteEvent(@PathVariable long id) { events.deleteById(id); }

    @GetMapping("/api/v1/admin/rates")
    List<RateItem> adminRates() { return rates.findAllByOrderBySortOrderAsc(); }

    @PostMapping("/api/v1/admin/rates")
    @ResponseStatus(HttpStatus.CREATED)
    RateItem createRate(@RequestBody RateItem body) { return rates.save(body); }

    @PatchMapping("/api/v1/admin/rates/{id}")
    RateItem patchRate(@PathVariable long id, @RequestBody RateItem body) {
        RateItem row = rates.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (body.getLane() != null) row.setLane(body.getLane());
        if (body.getService() != null) row.setService(body.getService());
        if (body.getRate() != null) row.setRate(body.getRate());
        if (body.getNotes() != null) row.setNotes(body.getNotes());
        return rates.save(row);
    }

    @DeleteMapping("/api/v1/admin/rates/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void deleteRate(@PathVariable long id) { rates.deleteById(id); }

    private static void bodySet(Lead body) {
        if (body.getStatus() == null) body.setStatus("warm");
        if (body.getLane() == null) body.setLane("modeling");
    }
}

record InquiryRequest(
        @NotBlank String name,
        @Email @NotBlank String email,
        String phone,
        @NotBlank String inquiryType,
        @NotBlank String eventDate,
        @NotBlank String location,
        String socialPlatform,
        String social,
        @NotBlank String message,
        String gotcha) {}

record LoginRequest(String username, String password) {}

record EventPatch(LocalDate eventDate, String title, String notes, String status, Boolean publiclyViewable) {}
