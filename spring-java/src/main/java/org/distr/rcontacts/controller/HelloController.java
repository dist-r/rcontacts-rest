package org.distr.rcontacts.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
public class HelloController {
    
    @GetMapping("/")
    public String healthCheck() {
        return "Service is up and running!";
    }
}
