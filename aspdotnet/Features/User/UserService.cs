namespace AspDotNet.Features.User;
using Microsoft.AspNetCore.Identity;
using AspDotNet.Infrastructure.Token;
using AspDotNet.Shared;

public class UserService(
        IUserRepository userRepository, 
        ILogger<UserService> logger,
        JwtService jwtService
    )
{
    private readonly IUserRepository _userRepository = userRepository;
    private readonly ILogger<UserService> _logger = logger;
    private readonly JwtService _jwtService = jwtService;
    public async Task<User> Register(string username, string name, string email, string password)
    {
        var user = new User
        {
            Id = Guid.NewGuid().ToString(),
            Username = username,
            Name = name,
            Email = email
        };

        var existingUser = await _userRepository.GetUserByEmail(email);
        if (existingUser != null)
        {
            _logger.LogInformation(null, "Email already in use");
            throw new AppException("Email already in use", 400);
        }

        var hashedPassword = new PasswordHasher<User>().HashPassword(user, password);
    
        var result = await _userRepository.Create(user.Id, user.Username, user.Name, user.Email, hashedPassword);

        var userWithoutPassword = new User
        {
            Id = result.Id,
            Username = result.Username,
            Name = result.Name,
            Email = result.Email
        };

        return userWithoutPassword;
    }

    public async Task<string> Login(string email, string password)
    {
        var user = await _userRepository.GetUserByEmail(email);
        if (user == null)
        {
            _logger.LogInformation(null, "User not found");
            throw new AppException("User not found", 404);
        }
        var verifyUserPasswordResult = new PasswordHasher<User>().VerifyHashedPassword(user, user.Password, password);
        if (verifyUserPasswordResult == PasswordVerificationResult.Failed)
        {
            _logger.LogInformation(null, "Invalid password");
            throw new AppException("Invalid password", 400);
        }

        var userId = user.Id;
        if (string.IsNullOrEmpty(userId))
        {
            _logger.LogError("User has no Id");
            throw new AppException("Invalid user data", 500);
        }

        if (string.IsNullOrEmpty(user.Email))
        {
            _logger.LogError("User has no Email");
            throw new AppException("Invalid user data", 500);
        }

        var token = _jwtService.GenerateAccessToken(userId, user.Email);

        return token;
    }

    public async Task<User> Profile(string id)
    {
        var user = await _userRepository.GetUserById(id);
        if (user == null)
        {
            _logger.LogInformation(null, "User not found");
            throw new AppException("User not found", 404);
        }

        var userWithoutPassword = new User
        {
            Id = user.Id,
            Username = user.Username,
            Name = user.Name,
            Email = user.Email
        };

        return userWithoutPassword;
    }
}