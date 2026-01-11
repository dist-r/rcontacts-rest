package org.distr.rcontacts.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
public class UserController {

    @PostMapping("/users")
    public String registerUser() {
        return "Hello from UserController!";
    }

    @GetMapping("/users")
    public String getProfileUser() {
        return "Hello from UserController!";
    }
}
