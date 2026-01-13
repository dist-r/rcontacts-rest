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
import java.util.Map;
import java.util.HashMap;

@Controller
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerUser(@Valid @RequestBody RegisterUserReq createUserRequest) {
        authService.createUser(
            createUserRequest.username(),
            createUserRequest.name(), 
            createUserRequest.password(), 
            createUserRequest.email()
        );
        Map<String, Object> response = new HashMap<>();
        response.put("status", true);
        response.put("message", "User created successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(@Valid @RequestBody LoginUserReq loginUserRequest) {
        String token = authService.loginUser(
            loginUserRequest.email(),
            loginUserRequest.password()
        );
        Map<String, Object> response = new HashMap<>();
        response.put("status", true);
        response.put("token", token);
        return ResponseEntity.ok(response);
    }
}