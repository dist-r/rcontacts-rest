package org.distr.rcontacts.controller;

import org.distr.rcontacts.app.ApiResponse;
import org.distr.rcontacts.contracts.UserContract;
import org.distr.rcontacts.service.UserService;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/v2/users")
public class UserController {

    private UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserContract>>getProfileUser() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = (String) auth.getPrincipal();
        UserContract profile = userService.getUserProfile(userId);
        return ResponseEntity.ok(new ApiResponse<>("User profile retrieved successfully", true, profile));
    
    }
}
