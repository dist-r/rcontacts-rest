package org.distr.rcontacts.contracts;

public record ContactContract(
    String id,
    String userId,
    String name,
    String email,
    String phone
) {
}
