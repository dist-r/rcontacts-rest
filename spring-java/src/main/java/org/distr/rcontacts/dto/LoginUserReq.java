package org.distr.rcontacts.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record LoginUserReq(
    @NotBlank @NotNull @Email String email,
    @NotBlank @NotNull String password
) {}
