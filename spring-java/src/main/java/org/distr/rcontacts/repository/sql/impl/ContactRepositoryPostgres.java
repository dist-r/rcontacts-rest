package org.distr.rcontacts.repository.sql.impl;

import org.distr.rcontacts.entities.ContactEntity;
import org.distr.rcontacts.repository.sql.ContactRepository;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.util.Optional;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.sql.SQLException;

@Repository
public class ContactRepositoryPostgres implements ContactRepository {

    private final DataSource dataSource;

    public ContactRepositoryPostgres(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public ContactEntity create(ContactEntity contact) {
        var sql = """
            INSERT INTO contacts (id, user_id, name, phone, email)
            VALUES (?, ?, ?, ?, ?)
            RETURNING id, user_id, name, phone, email
            """;

        try (
            var connection = dataSource.getConnection();
            var statement = connection.prepareStatement(sql)
        ) {
            var id = UUID.randomUUID().toString();

            statement.setString(1, id);
            statement.setString(2, contact.getUserId());
            statement.setString(3, contact.getName());
            statement.setString(4, contact.getPhone());
            statement.setString(5, contact.getEmail());

            try (var rs = statement.executeQuery()) {
                if (rs.next()) {
                    return new ContactEntity(
                            rs.getString("id"),
                            rs.getString("user_id"),
                            rs.getString("name"),
                            rs.getString("phone"),
                            rs.getString("email")
                    );
                }
            }
            throw new RuntimeException("Insert succeeded but no row returned");
        } catch (SQLException e) {
            throw new RuntimeException("Failed to create contact", e);
        }
    }

    @Override
    public List<ContactEntity> findAllByUserId(String userId) {
     
        List<ContactEntity> contacts = new ArrayList<>();

        try (var connection = dataSource.getConnection()) {
            var sql = "SELECT id, user_id, name, phone, email FROM contacts WHERE user_id = ?";
            try (var statement = connection.prepareStatement(sql)) {
                statement.setString(1, userId);
                try (var resultSet = statement.executeQuery()) {
                    while (resultSet.next()) {
                        var contact = new ContactEntity(
                                resultSet.getString("id"),
                                resultSet.getString("user_id"),
                                resultSet.getString("name"),
                                resultSet.getString("phone"),
                                resultSet.getString("email")
                        );
                        contacts.add(contact);
                    }
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        } catch (Exception e) {
            e.printStackTrace();
           throw new RuntimeException(e);
        }
        return contacts;
    }

    @Override
    public Optional<ContactEntity> findById(String id) {
        
        // Implementation for finding a contact by ID
        try (var connection = dataSource.getConnection()) {
            var sql = "SELECT id, user_id, name, phone, email FROM contacts WHERE id = ?";
            try (var statement = connection.prepareStatement(sql)) {
                statement.setString(1, id);
                try (var resultSet = statement.executeQuery()) {
                    if (resultSet.next()) {
                        var contact = new ContactEntity(
                                resultSet.getString("id"),
                                resultSet.getString("user_id"),
                                resultSet.getString("name"),
                                resultSet.getString("phone"),
                                resultSet.getString("email")
                        );
                        return Optional.of(contact);
                    }
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return Optional.empty();
    }

   @Override
    public ContactEntity update(ContactEntity contact) {
        try (
            var connection = dataSource.getConnection();
            var statement = connection.prepareStatement("""
                UPDATE contacts
                SET name = ?, phone = ?, email = ?
                WHERE id = ?
                RETURNING id, user_id, name, phone, email
            """)
        ) {
            statement.setString(1, contact.getName());
            statement.setString(2, contact.getPhone());
            statement.setString(3, contact.getEmail());
            statement.setString(4, contact.getId());

            try (var rs = statement.executeQuery()) {
                if (rs.next()) {
                    return new ContactEntity(
                        rs.getString("id"),
                        rs.getString("user_id"),
                        rs.getString("name"),
                        rs.getString("phone"),
                        rs.getString("email")
                    );
                }
            }

            throw new RuntimeException("Contact not found");
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
    
    @Override
    public void delete(String id) {

        // Implementation for deleting a contact
        try (var connection = dataSource.getConnection()) {
            var sql = "DELETE FROM contacts WHERE id = ?";
            try (var statement = connection.prepareStatement(sql)) {
                statement.setString(1, id);
                statement.executeUpdate();
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}