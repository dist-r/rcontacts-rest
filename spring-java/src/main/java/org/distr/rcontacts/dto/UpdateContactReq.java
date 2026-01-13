package org.distr.rcontacts.dto;

public record UpdateContactReq(
    String name,
    String phone,
    String email
) {
    
}
