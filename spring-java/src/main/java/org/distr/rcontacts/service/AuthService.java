package org.distr.rcontacts.service;

import org.distr.rcontacts.entities.UserEntity;
import org.distr.rcontacts.exception.AppException;
import org.distr.rcontacts.repository.sql.UserRepository;
import org.distr.rcontacts.utils.JwtUtil;
import org.distr.rcontacts.utils.HashPassword;

import org.springframework.stereotype.Service;


@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil JwtUtil;
    private final HashPassword hashPassword;

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil, HashPassword hashPassword) {
        this.userRepository = userRepository;
        this.JwtUtil = jwtUtil;
        this.hashPassword = hashPassword;
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
                user.setPassword(hashPassword.hash(password));
                userRepository.create(user);
            }
        );
    }

    public String loginUser(String email, String password){
        String token;
        userRepository.findByEmail(email).ifPresentOrElse(
            (user) -> {
                if(!hashPassword.verify(password, user.getPassword())){
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
