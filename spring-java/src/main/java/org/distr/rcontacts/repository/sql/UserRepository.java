package org.distr.rcontacts.repository.sql;
import org.distr.rcontacts.entities.UserEntity;
import java.util.Optional;

public interface UserRepository {

    public void create(UserEntity user);
    public Optional<UserEntity> findById(String id);
    public Optional<UserEntity> findByEmail(String email);
    
}