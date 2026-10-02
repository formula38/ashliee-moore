package com.triple8.ashliee.web;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/** Unversioned paths are not a contract. Callers must use /api/v1. */
@RestController
class UnversionedApi {
    @RequestMapping({
            "/api/looks",
            "/api/events",
            "/api/events/{id}",
            "/api/inquiries",
            "/api/admin",
            "/api/admin/**"
    })
    void missing() {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Use /api/v1");
    }
}
