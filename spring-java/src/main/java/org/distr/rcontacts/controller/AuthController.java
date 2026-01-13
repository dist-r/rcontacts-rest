package org.distr.rcontacts.controller;

import org.distr.rcontacts.dto.LoginUserReq;
import org.distr.rcontacts.dto.RegisterUserReq;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import org.distr.rcontacts.service.AuthService;

import jakarta.validation.Valid;

@Controller
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@Valid @RequestBody RegisterUserReq createUserRequest) {
        authService.createUser(
            createUserRequest.username(),
            createUserRequest.name(), 
            createUserRequest.password(), 
            createUserRequest.email()
        );
        return ResponseEntity.ok("User created successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@Valid @RequestBody LoginUserReq loginUserRequest) {
        // Implement login logic here
        return ResponseEntity.ok("Login successful!");
    }
}