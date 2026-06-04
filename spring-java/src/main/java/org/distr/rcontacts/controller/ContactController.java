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

import org.distr.rcontacts.dto.CreateContact;
import org.distr.rcontacts.dto.UpdateContactReq;
import org.distr.rcontacts.service.ContactService;
import org.distr.rcontacts.app.ApiResponse;
import org.distr.rcontacts.contracts.ContactContract;

@RestController
@RequestMapping("/api/v2")
public class ContactController {

    private ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @GetMapping("/contacts")
    public ResponseEntity<ApiResponse<List<ContactContract>>> getAllContacts() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = (String) auth.getPrincipal();
        List<ContactContract> contacts = contactService.getAllContactsByUserId(userId);
        return ResponseEntity.ok(new ApiResponse<>("Contacts retrieved successfully", true, contacts));
    }

    @PostMapping("/contacts")
    public ResponseEntity<ApiResponse<ContactContract>>createContact(
        @RequestBody CreateContact createContactRequest
    ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = (String) auth.getPrincipal();
        ContactContract createdContact = contactService.CreateContact(
            userId,
            createContactRequest.name(),
            createContactRequest.phone(),
            createContactRequest.email()
        );
        return ResponseEntity.ok(new ApiResponse<>("Contact created successfully", true, createdContact));
    }

    @PutMapping("/contacts/{contactId}")
    public ResponseEntity<ApiResponse<ContactContract>>updateContact(
        @RequestBody UpdateContactReq updateContactRequest, 
        @PathVariable String contactId
    ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = (String) auth.getPrincipal();
        ContactContract updatedContact = contactService.updateContact(
            contactId,
            userId,
            updateContactRequest.name(),
            updateContactRequest.phone(),
            updateContactRequest.email()
        );
        return ResponseEntity.ok(new ApiResponse<>("Contact updated successfully", true, updatedContact));
    }

    @DeleteMapping("/contacts/{contactId}")
    public ResponseEntity<ApiResponse<Object>> deleteContact(@PathVariable String contactId) {
        contactService.deleteContact(contactId);
        return ResponseEntity.ok(new ApiResponse<>("Contact deleted successfully", true, null));
    }

}