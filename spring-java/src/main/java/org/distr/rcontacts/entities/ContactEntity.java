package org.distr.rcontacts.entities;

// POJO for JDBC Implementation

public class ContactEntity {

    private String id;
    private String userId;
    private String name;
    private String phone;
    private String email;

    public ContactEntity(String id, String userId, String name, String phone, String email) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.phone = phone;
        this.email = email;
    }

    public String getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public String getPhone() {
        return phone;
    }

    public String getEmail() {
        return email;
    }

}
