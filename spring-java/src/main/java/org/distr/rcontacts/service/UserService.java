package org.distr.rcontacts.service;

import org.distr.rcontacts.repository.sql.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Map;
import java.util.HashMap;

import org.distr.rcontacts.entities.UserEntity;
import org.distr.rcontacts.exception.AppException;

@Service
@RequestMapping("/api/v1/users")
public class UserService {
    
    private UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public String test() {
        return "Hello from UserService!";
    }

    @GetMapping("/profile")
    public Map<String, Object>getUserById(String userId){
        // return userRepository.findById(userId).orElseThrow(
        //     () -> new AppException("User with id " + userId + " not found.", 404)
        // );
        UserEntity user = userRepository.findById(userId).orElseThrow(
            () -> new AppException("User with id " + userId + " not found.", 404)
        );
        
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("username", user.getUsername());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        return response;
    }
}
