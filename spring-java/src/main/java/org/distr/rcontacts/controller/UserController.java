package org.distr.rcontacts.controller;

import org.distr.rcontacts.dto.RegisterUserReq;
import org.distr.rcontacts.service.UserService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
public class UserController {

    private UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public ResponseEntity<String> getProfileUser() {
        // return userService.getUserBy("1");
        return ResponseEntity.ok("Hello from UserController!");
    }
}
