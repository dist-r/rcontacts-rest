package org.distr.rcontacts.utils;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class HashPassword {
    
    private final BCryptPasswordEncoder passwordEncoder;

    public HashPassword(BCryptPasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    public String hash(String plainPassword) {
        return passwordEncoder.encode(plainPassword);
    }

    public boolean verify(String plainPassword, String hashedPassword) {
        return passwordEncoder.matches(plainPassword, hashedPassword);
    }
}