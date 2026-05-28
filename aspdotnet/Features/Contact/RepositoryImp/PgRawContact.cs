namespace AspDotNet.Features.Contact.RepositoryImp;

using AspDotNet.Features.Contact;
using Microsoft.Extensions.Configuration;
using Npgsql;

public class PgRawContactRepository(IConfiguration configuration) : IContactRepository
{
    private readonly string _connectionString =
            configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException(
                "DefaultConnection is not configured");

  public async Task<Contact?> GetContactById(string id)
    {
        await using var connection =
            new NpgsqlConnection(_connectionString);

        await connection.OpenAsync();

        const string sql = """
            SELECT
                id,
                user_id,
                name,
                email,
                phone
            FROM contacts
            WHERE id = @id
            """;

        await using var command =
            new NpgsqlCommand(sql, connection);

        command.Parameters.AddWithValue("id", id);

        await using var reader =
            await command.ExecuteReaderAsync();

        if (await reader.ReadAsync())
        {
            return MapContact(reader);
        }

        return null;
    }

    public async Task<List<Contact>> GetAllByUserId(string userId)
    {
        var contacts = new List<Contact>();

        await using var connection =
            new NpgsqlConnection(_connectionString);

        await connection.OpenAsync();

        const string sql = """
            SELECT
                id,
                user_id,
                name,
                email,
                phone
            FROM contacts
            WHERE user_id = @userId
            """;

        await using var command =
            new NpgsqlCommand(sql, connection);

        command.Parameters.AddWithValue("userId", userId);

        await using var reader =
            await command.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            contacts.Add(MapContact(reader));
        }

        return contacts;
    }

    public async Task<Contact> Create(Contact contact)
    {
        await using var connection =
            new NpgsqlConnection(_connectionString);

        await connection.OpenAsync();

        const string sql = """
            INSERT INTO contacts
            (
                id,
                user_id,
                name,
                email,
                phone
            )
            VALUES
            (
                @id,
                @userId,
                @name,
                @email,
                @phone
            )
            RETURNING
                id,
                user_id,
                name,
                email,
                phone
            """;

        await using var command =
            new NpgsqlCommand(sql, connection);

        command.Parameters.AddWithValue("id", contact.Id);
        command.Parameters.AddWithValue("userId", contact.UserId);
        command.Parameters.AddWithValue("name", contact.Name);
        command.Parameters.AddWithValue("email", contact.Email);
        command.Parameters.AddWithValue("phone", contact.Phone);

        await using var reader =
            await command.ExecuteReaderAsync();

        if(!await reader.ReadAsync())
        {
            throw new Exception("Failed to create contact");
        }

        return MapContact(reader);
    }

    public async Task<Contact> Update(Contact contact)
    {
        await using var connection =
            new NpgsqlConnection(_connectionString);

        await connection.OpenAsync();

        const string sql = """
            UPDATE contacts
            SET
                name = @name,
                email = @email,
                phone = @phone
            WHERE id = @id
            RETURNING
                id,
                user_id,
                name,
                email,
                phone
            """;

        await using var command =
            new NpgsqlCommand(sql, connection);

        command.Parameters.AddWithValue("id", contact.Id);
        command.Parameters.AddWithValue("name", contact.Name);
        command.Parameters.AddWithValue("email", contact.Email);
        command.Parameters.AddWithValue("phone", contact.Phone);

        await using var reader =
            await command.ExecuteReaderAsync();
        
        if(!await reader.ReadAsync())
        {
            throw new Exception("Failed to update contact");
        }

        return MapContact(reader);
    }

    public async Task<Contact> Delete(string id)
    {
        await using var connection =
            new NpgsqlConnection(_connectionString);

        await connection.OpenAsync();

        const string sql = """
            DELETE FROM contacts
            WHERE id = @id
            RETURNING
                id,
                user_id,
                name,
                email,
                phone
            """;

        await using var command =
            new NpgsqlCommand(sql, connection);

        command.Parameters.AddWithValue("id", id);

        await using var reader =
            await command.ExecuteReaderAsync();

        if (!await reader.ReadAsync())
        {
            throw new Exception("Failed to delete contact");
        }

        return MapContact(reader);
    }

    private static Contact MapContact(NpgsqlDataReader reader)
    {
        return new Contact
        {
            Id = reader.GetString(
                reader.GetOrdinal("id")),

            UserId = reader.GetString(
                reader.GetOrdinal("user_id")),

            Name = reader.GetString(
                reader.GetOrdinal("name")),

            Email = reader.GetString(
                reader.GetOrdinal("email")),

            Phone = reader.GetString(
                reader.GetOrdinal("phone"))
        };
    }
}