package org.distr.rcontacts.entities;

// POJO For JDBC Implementation

public class UserEntity {

    private String id;
    private String username;
    private String name;
    private String password;
    private String email;

    public UserEntity(String id, String username, String name, String password, String email) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.password = password;
        this.email = email;
    }

    public String getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getName() {
        return name;
    }

    public String getPassword() {
        return password;
    }

    public String getEmail() {
        return email;
    }
}
