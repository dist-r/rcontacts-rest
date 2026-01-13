package org.distr.rcontacts.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterUserReq (
    @NotBlank String username,
    String name,
    @NotBlank String password,
    @NotBlank @Email String email
) {
}