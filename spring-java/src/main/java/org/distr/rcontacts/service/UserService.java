package org.distr.rcontacts.service;

import org.distr.rcontacts.repository.sql.UserRepository;
import org.springframework.stereotype.Service;
import org.distr.rcontacts.entities.UserEntity;

@Service
public class UserService {
    
    private UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public String test() {
        return "Hello from UserService!";
    }

    public void createUser(String username, String name, String password, String email){
        userRepository.findByEmail(email).ifPresentOrElse(
            (user) -> {
                throw new RuntimeException("User with email " + email + " already exists.");
            },
            () -> {
                UserEntity user = new UserEntity(
                    null,
                    username,
                    name,
                    password,
                    email
                );
                userRepository.create(user);
            }
        );
    }

    public UserEntity getUserById(String userId){
        return userRepository.findById(userId).orElseThrow(
            () -> new RuntimeException("User with id " + userId + " not found.")
        );
    }
}
