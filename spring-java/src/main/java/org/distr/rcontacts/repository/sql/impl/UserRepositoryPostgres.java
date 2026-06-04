package org.distr.rcontacts.repository.sql.impl;

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
    public UserEntity create(UserEntity user) {
       
        var sql = """
        INSERT INTO users (id, username, name, password, email)
        VALUES (?, ?, ?, ?, ?)
        RETURNING id, username, name, password, email
        """;
        try (
            var connection = dataSource.getConnection();
            var statement = connection.prepareStatement(sql)
        ) {
            var id = UUID.randomUUID().toString();

            statement.setString(1, id);
            statement.setString(2, user.getUsername());
            statement.setString(3, user.getName());
            statement.setString(4, user.getPassword());
            statement.setString(5, user.getEmail());

            try (var rs = statement.executeQuery()) {
                if (rs.next()) {
                    return new UserEntity(
                            rs.getString("id"),
                            rs.getString("username"),
                            rs.getString("name"),
                            rs.getString("password"),
                            rs.getString("email")
                    );
                }
            }
            throw new RuntimeException("Insert succeeded but no row returned");
        } catch (SQLException e) {
            throw new RuntimeException("Failed to create user", e);
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
