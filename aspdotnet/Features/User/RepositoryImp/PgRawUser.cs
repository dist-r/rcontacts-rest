namespace AspDotNet.Features.User.RepositoryImp;
using AspDotNet.Features.User;
using Microsoft.Extensions.Configuration;
using Npgsql;

public class PgRawUserRepository(IConfiguration configuration, ILogger<PgRawUserRepository> logger) : IUserRepository
{
    private readonly string _connectionString =
            configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException(
                "DefaultConnection is not configured");
    private readonly ILogger<PgRawUserRepository> _logger = logger;

  public async Task<User?> GetUserById(string id)
    {
        await using var connection =
            new NpgsqlConnection(_connectionString);

        await connection.OpenAsync();

        const string sql = """
            SELECT
                id,
                username,
                name,
                email,
                password
            FROM users
            WHERE id = @id
            """;

        await using var command =
            new NpgsqlCommand(sql, connection);

        command.Parameters.AddWithValue("id", id);

        await using var reader =
            await command.ExecuteReaderAsync();

        if (await reader.ReadAsync())
        {
            return MapUser(reader);
        }

        return null;
    }

    public async Task<User?> GetUserByEmail(string email)
    {
        try
        {
            await using var connection =
            new NpgsqlConnection(_connectionString);

            await connection.OpenAsync();

            const string sql = """
                SELECT
                    id,
                    username,
                    name,
                    email,
                    password
                FROM users
                WHERE email = @email
                """;

            await using var command =
                new NpgsqlCommand(sql, connection);

            command.Parameters.AddWithValue("email", email);

            await using var reader =
                await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return MapUser(reader);
            }
            return null;
        } 
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user by email");
            throw new Exception(ex.Message);
        }
    }

    public async Task<User> Create(string id, string username, string name, string email, string password)
    {

        try
        {
            await using var connection = new NpgsqlConnection(_connectionString);

            await connection.OpenAsync();

            const string sql = """
                INSERT INTO users (id, username, name, email, password)
                VALUES (@id, @username, @name, @email, @password)
                RETURNING id, username, name, email, password
                """;

            await using var command = new NpgsqlCommand(sql, connection);

            command.Parameters.AddWithValue("id", id);
            command.Parameters.AddWithValue("username", username);
            command.Parameters.AddWithValue("name", name);
            command.Parameters.AddWithValue("email", email);
            command.Parameters.AddWithValue("password", password); 

            await using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return MapUser(reader);
            } else
            {
                throw new Exception("User not created");
            }
           
        } catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating user");
            throw new Exception(ex.Message);
        }
    }
    private static User MapUser(NpgsqlDataReader reader)
    {
        return new User
        {
            Id = reader.GetString(reader.GetOrdinal("id")),
            Username = reader.GetString(reader.GetOrdinal("username")),
            Name = reader.GetString(reader.GetOrdinal("name")),
            Email = reader.GetString(reader.GetOrdinal("email")),
            Password = reader.GetString(reader.GetOrdinal("password"))
        };
    }
}