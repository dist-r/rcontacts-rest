namespace AspDotNet.Features.User;

public interface IUserRepository
{
  Task<User?> GetUserById(string id);

  Task<User?> GetUserByEmail(string email);

  Task<User>  Create(string id, string username, string name, string email, string password);

}