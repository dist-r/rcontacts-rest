package org.distr.rcontacts.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;

@RestController
public class ContactController {

    @GetMapping("/contacts")
    public String getAllContacts() {
        return "Hello from ContactController!";
    }

    @PostMapping("/contacts")
    public String createContact() {
        return "Hello from ContactController!";
    }

    @PutMapping("/contacts")
    public String updateContact() {
        return "Hello from ContactController!";
    }

    @DeleteMapping("/contacts")
    public String deleteContact() {
        return "Hello from ContactController!";
    }

}