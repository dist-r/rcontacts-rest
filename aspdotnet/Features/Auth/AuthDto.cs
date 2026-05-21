namespace AspDotNet.Features.Auth;
using AspDotNet.Features.User;

public class RegisterRequest
{ 
    public string Username { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; }  = string.Empty;
}

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; }  = string.Empty;
}

public class RegisterResponse
{
   public string Id { get; set; } = string.Empty;
   public string Username { get; set; } = string.Empty;
   public string Name { get; set; } = string.Empty;
   public string Email { get; set; } = string.Empty;
}




public class LoginResponse {
  public string Token { get; set; } = string.Empty;


}