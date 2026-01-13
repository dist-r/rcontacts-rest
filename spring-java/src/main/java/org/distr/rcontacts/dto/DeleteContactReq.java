package org.distr.rcontacts.dto;

import jakarta.validation.constraints.NotBlank;

public record DeleteContactReq(
    @NotBlank String contactId
) {
}
