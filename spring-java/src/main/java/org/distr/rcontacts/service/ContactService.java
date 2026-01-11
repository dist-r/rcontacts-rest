package org.distr.rcontacts.service;

import java.util.List;

import org.distr.rcontacts.repository.sql.ContactRepository;
import org.distr.rcontacts.entities.ContactEntity;

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
    public void CreateContact(String userId, String name, String phone, String email){
        ContactEntity contact = new ContactEntity(
            null,
            userId,
            name,
            phone,
            email
        );
        contactRepository.create(contact);
    }

    @Transactional
    public List<ContactEntity> getAllContactsByUserId(String userId){
        return contactRepository.findAllByUserId(userId);
    }

    @Transactional
    public void deleteContact(String contactId){
        contactRepository.delete(contactId);
    }

    @Transactional
    public void updateContact(String contactId, String userId,  String name, String phone, String email){
        ContactEntity contact = new ContactEntity(
            contactId,
            userId,
            name,
            phone,
            email
        );
        contactRepository.update(contact);
    }    

}
