package org.distr.rcontacts.service;

import org.distr.rcontacts.repository.sql.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Optional;

import org.distr.rcontacts.contracts.UserContract;
import org.distr.rcontacts.entities.UserEntity;
import org.distr.rcontacts.exception.AppException;

@Service
@RequestMapping("/api/v1/users")
public class UserService {
    
    private UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/profile")
    public UserContract getUserProfile(String userId){
        Optional<UserEntity> user = userRepository.findById(userId);
        if(user.isEmpty()){
            throw new AppException("User not found", 404);
        }
        return new UserContract(
            user.get().getId(),
            user.get().getUsername(),
            user.get().getName(),
            user.get().getEmail()
        );
    }
}
