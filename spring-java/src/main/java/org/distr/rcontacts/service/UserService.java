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


    public UserEntity getUserById(String userId){
        return userRepository.findById(userId).orElseThrow(
            () -> new RuntimeException("User with id " + userId + " not found.")
        );
    }
}
