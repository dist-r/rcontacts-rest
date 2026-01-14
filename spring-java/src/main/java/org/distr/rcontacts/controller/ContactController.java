package org.distr.rcontacts.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;
import java.util.Map;

import org.distr.rcontacts.dto.CreateContact;
import org.distr.rcontacts.dto.UpdateContactReq;
import org.distr.rcontacts.service.ContactService;

@RestController
@RequestMapping("/api/v1")
public class ContactController {

    private ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @GetMapping("/contacts")
    public List<?> getAllContacts() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = (String) auth.getPrincipal();
        return contactService.getAllContactsByUserId(userId);
    }

    @PostMapping("/contacts")
    public ResponseEntity<Map<String, Object>>createContact(
        @RequestBody CreateContact createContactRequest
    ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = (String) auth.getPrincipal();
        contactService.CreateContact(
            userId,
            createContactRequest.name(),
            createContactRequest.phone(),
            createContactRequest.email()
        );
        return ResponseEntity.ok(Map.of("message", "Contact created successfully"));
    }

    @PutMapping("/contacts/{contactId}")
    public ResponseEntity<Map<String, Object>>updateContact(
        @RequestBody UpdateContactReq updateContactRequest, 
        @PathVariable String contactId
    ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = (String) auth.getPrincipal();
        contactService.updateContact(
            (String) contactId,
            userId,
            updateContactRequest.name(),
            updateContactRequest.phone(),
            updateContactRequest.email()
        );
        return ResponseEntity.ok(Map.of("message", "Contact updated successfully"));
    }

    @DeleteMapping("/contacts/{contactId}")
    public ResponseEntity<Map<String, Object>> deleteContact(@PathVariable String contactId) {
        contactService.deleteContact(contactId);
        return ResponseEntity.status(204).build();
    }

}