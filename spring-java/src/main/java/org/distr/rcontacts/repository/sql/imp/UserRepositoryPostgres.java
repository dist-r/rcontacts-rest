package org.distr.rcontacts.repository.sql.imp;

import org.distr.rcontacts.entities.UserEntity;
import org.distr.rcontacts.repository.sql.UserRepository;
import org.springframework.stereotype.Repository;

import java.sql.SQLException;
import javax.sql.DataSource;
import java.util.Optional;
import java.util.UUID;

@Repository
public class UserRepositoryPostgres implements UserRepository {

    private final DataSource dataSource;
    
    public UserRepositoryPostgres(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void create(UserEntity user) {
        // Implementation for creating a user
        try(var connection = dataSource.getConnection()) {
            var sql = "INSERT INTO users (id, username, name, password, email) VALUES (?, ?, ?, ?, ?)";
            try (var statement = connection.prepareStatement(sql)) {
                UUID id = UUID.randomUUID();
                statement.setString(1, id.toString());
                statement.setString(2, user.getUsername());
                statement.setString(3, user.getName());
                statement.setString(4, user.getPassword());
                statement.setString(5, user.getEmail());
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
    public Optional<UserEntity> findById(String id) {
        // Implementation for finding a user by ID
        try(var connection = dataSource.getConnection()) {
            var sql = "SELECT id, username, name, password, email FROM users WHERE id = ?";
            try (var statement = connection.prepareStatement(sql)) {
                statement.setString(1, id);
                try (var resultSet = statement.executeQuery()) {
                    if (resultSet.next()) {
                        var user = new UserEntity(
                                resultSet.getString("id"),
                                resultSet.getString("username"),
                                resultSet.getString("name"),
                                resultSet.getString("password"),
                                resultSet.getString("email")
                        );
                        return Optional.of(user);
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
    public Optional<UserEntity> findByEmail(String email) {
        // Implementation for finding a user by email
        try(var connection = dataSource.getConnection()) {
            var sql = "SELECT id, username, name, password, email FROM users WHERE email = ?";
            try (var statement = connection.prepareStatement(sql)) {
                statement.setString(1, email);
                try (var resultSet = statement.executeQuery()) {
                    if (resultSet.next()) {
                        var user = new UserEntity(
                                resultSet.getString("id"),
                                resultSet.getString("username"),
                                resultSet.getString("name"),
                                resultSet.getString("password"),
                                resultSet.getString("email")
                        );
                        return Optional.of(user);
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
    
}
