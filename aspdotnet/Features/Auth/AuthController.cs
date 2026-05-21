namespace AspDotNet.Features.Auth;

using Microsoft.AspNetCore.Mvc;
using AspDotNet.Features.User;
using AspDotNet.Shared;

[ApiController]
[Route("api/v1/auth")]
public class AuthController : ControllerBase
{
    private readonly UserService _userService;

    public AuthController(UserService userService)
    {
        _userService = userService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> RegisterUser([FromBody] RegisterRequest request)
    {
        var result = await _userService.Register(request.Username, request.Name, request.Email, request.Password);
        return Ok(new ApiResponse<RegisterResponse>("Success", new RegisterResponse {
            Id = result.Id,
            Username = result.Username,
            Name = result.Name,
            Email = result.Email
        }));
    }

    [HttpPost("login")]
    public async Task<IActionResult> LoginUser([FromBody] LoginRequest request)
    {
        var result = await _userService.Login(request.Email, request.Password);
        return Ok(new ApiResponse<LoginResponse>("Success", new LoginResponse { Token = result }));
    }
}