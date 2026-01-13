package org.distr.rcontacts.service;

import org.distr.rcontacts.entities.UserEntity;
import org.distr.rcontacts.exception.AppException;
import org.distr.rcontacts.repository.sql.UserRepository;
import org.distr.rcontacts.utils.JwtUtil;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil JwtUtil;

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.JwtUtil = jwtUtil;
    }

    public void createUser(String username, String name, String password, String email){
        userRepository.findByEmail(email).ifPresentOrElse(
            (user) -> {
                throw new AppException("User with email " + email + " already exists.", 400);
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

    public String loginUser(String email, String password){
        String token;
        userRepository.findByEmail(email).ifPresentOrElse(
            (user) -> {
                if(!user.getPassword().equals(password)){
                    throw new AppException("Invalid password.", 400);
                }
            },
            () -> {
                throw new AppException("User with email " + email + " not found.", 404);
            }
        );
        String userId = userRepository.findByEmail(email).get().getId();
        token = JwtUtil.generateToken(userId, email);
        return token;
    }

}
