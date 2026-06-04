package org.distr.rcontacts.contracts;

public record UserContract(
    String id,
    String username,
    String name,
    String email
) {
}
