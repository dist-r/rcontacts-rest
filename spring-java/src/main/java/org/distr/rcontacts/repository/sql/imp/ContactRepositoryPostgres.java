package org.distr.rcontacts.repository.sql.imp;

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
    public void create(ContactEntity contact) {
        // Implementation for creating a contact

        try (var connection = dataSource.getConnection()) {
            var sql = "INSERT INTO contacts (id, user_id, name, phone, email) VALUES (?, ?, ?, ?, ?)";
            try (var statement = connection.prepareStatement(sql)) {
                UUID id = UUID.randomUUID();
                statement.setString(1, id.toString());
                statement.setString(2, contact.getUserId());
                statement.setString(3, contact.getName());
                statement.setString(4, contact.getPhone());
                statement.setString(5, contact.getEmail());
                statement.executeUpdate();
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        } catch (Exception e) {
            e.printStackTrace();
            // throw new RuntimeException(e);
        }
    }

    @Override
    public List<ContactEntity> findAllByUserId(String userId) {
        // Implementation for finding all contacts by user ID
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
    public void update(ContactEntity contact) {

        // Implementation for updating a contact
        try(var connection = dataSource.getConnection()) {
            var sql = "UPDATE contacts SET name = ?, phone = ?, email = ? WHERE id = ?";
            try (var statement = connection.prepareStatement(sql)) {
                statement.setString(1, contact.getName());
                statement.setString(2, contact.getPhone());
                statement.setString(3, contact.getEmail());
                statement.setString(4, contact.getId());
                statement.executeUpdate();
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        } catch (Exception e) {
            e.printStackTrace();
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