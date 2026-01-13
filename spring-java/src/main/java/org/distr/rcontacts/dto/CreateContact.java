package org.distr.rcontacts.dto;

public record CreateContact(
    String name,
    String phone,
    String email
) {
}