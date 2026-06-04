package org.distr.rcontacts.repository.sql;

import org.distr.rcontacts.entities.ContactEntity;
import java.util.Optional;
import java.util.List;

public interface ContactRepository {

    public ContactEntity create(ContactEntity contact);
    public ContactEntity update(ContactEntity contact);
    public Optional<ContactEntity> findById(String id);
    public List<ContactEntity> findAllByUserId(String userId);
    public void delete(String id);

}
