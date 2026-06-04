package org.distr.rcontacts.service;

import java.util.List;

import org.distr.rcontacts.repository.sql.ContactRepository;
import org.distr.rcontacts.entities.ContactEntity;
import org.distr.rcontacts.exception.AppException;
import org.distr.rcontacts.contracts.ContactContract;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ContactService {
    
    private ContactRepository contactRepository;

    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    public String test() {
        return "Hello from ContactService!";
    }

    @Transactional
    public ContactContract CreateContact(String userId, String name, String phone, String email){
        ContactEntity contact = new ContactEntity(
            null,
            userId,
            name,
            phone,
            email
        );
        var result = contactRepository.create(contact);
        var contactContract = new ContactContract(
            result.getId(),
            result.getUserId(),
            result.getName(),
            result.getPhone(),
            result.getEmail()
        );
        return contactContract;
        
    }

    @Transactional( readOnly = true )
    public List<ContactContract> getAllContactsByUserId(String userId){
        var contacts = contactRepository.findAllByUserId(userId);
        return contacts.stream().map(contact -> new ContactContract(
            contact.getId(),
            contact.getUserId(),
            contact.getName(),
            contact.getPhone(),
            contact.getEmail()
        )).toList();
    }

    @Transactional
    public void deleteContact(String contactId){
        var existingContact = contactRepository.findById(contactId);
        if(existingContact.isEmpty()){
            throw new AppException("Contact not Found", 404);
        }
        contactRepository.delete(contactId);
    }

    @Transactional
    public ContactContract updateContact(String contactId, String userId,  String name, String phone, String email){
        ContactEntity contact = new ContactEntity(
            contactId,
            userId,
            name,
            phone,
            email
        );
        var existingContact = contactRepository.findById(contactId);
        if(existingContact.isEmpty()){
            throw new AppException("Contact not Found", 404);
        }
        if(!existingContact.get().getUserId().equals(userId)){
            throw new AppException("Unauthorized", 403);
        }
        var result = contactRepository.update(contact);
        var contactContract = new ContactContract(
            result.getId(),
            result.getUserId(),
            result.getName(),
            result.getPhone(),
            result.getEmail()
        );
        return contactContract;
    }

}
