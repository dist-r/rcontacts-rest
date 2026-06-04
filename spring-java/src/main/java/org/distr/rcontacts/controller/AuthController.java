package org.distr.rcontacts.controller;

import org.distr.rcontacts.app.ApiResponse;
import org.distr.rcontacts.contracts.LoginContract;
import org.distr.rcontacts.contracts.UserContract;
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
@RequestMapping("/api/v2/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserContract>> registerUser(@Valid @RequestBody RegisterUserReq createUserRequest) {
        
        UserContract createdUser = authService.createUser(
            createUserRequest.username(),
            createUserRequest.name(),
            createUserRequest.password(),
            createUserRequest.email()
        );
        return ResponseEntity.ok(new ApiResponse<UserContract>("User registered successfully", true, createdUser));

    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginContract>> loginUser(@Valid @RequestBody LoginUserReq loginUserRequest) {
        String token = authService.loginUser(
            loginUserRequest.email(),
            loginUserRequest.password()
        );
        return ResponseEntity.ok(new ApiResponse<LoginContract>("Login successful", true, new LoginContract(token)));
    }
}