package org.distr.rcontacts.service;

import org.distr.rcontacts.contracts.UserContract;
import org.distr.rcontacts.entities.UserEntity;
import org.distr.rcontacts.exception.AppException;
import org.distr.rcontacts.repository.sql.UserRepository;
import org.distr.rcontacts.utils.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.distr.rcontacts.utils.HashPassword;

import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
    private final UserRepository userRepository;
    private final JwtUtil JwtUtil;
    private final HashPassword hashPassword;

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil, HashPassword hashPassword) {
        this.userRepository = userRepository;
        this.JwtUtil = jwtUtil;
        this.hashPassword = hashPassword;
    }

    public UserContract createUser(String username, String name, String password, String email) {
        if(userRepository.findByEmail(email).isPresent()){
            logger.debug("User with email " + email + " already exists.");
            throw new AppException("User with email " + email + " already exists.", 400);
        }
        String hashedPassword = hashPassword.hash(password);
        UserEntity newUser = new UserEntity(null,username, name, hashedPassword, email);
        UserEntity savedUser = userRepository.create(newUser);
        logger.debug("User created successfully with email: " + email);
        return new UserContract(savedUser.getId(), savedUser.getUsername(), savedUser.getName(), savedUser.getEmail());
    }

    public String loginUser(String email, String password) {
        userRepository.findByEmail(email).ifPresentOrElse(
            (user) -> {
                if(!hashPassword.verify(password, user.getPassword())){
                    logger.debug("Invalid password.");
                    throw new AppException("Invalid password.", 400);
                }

            },
            () -> {
                logger.debug("User with email " + email + " not found.");
                throw new AppException("User with email " + email + " not found.", 404);
            }
        );
        String userId = userRepository.findByEmail(email).get().getId();
        String token = JwtUtil.generateToken(userId, email);
        return token;
    }

}
