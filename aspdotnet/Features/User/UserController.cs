namespace AspDotNet.Features.User;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AspDotNet.Shared;

[ApiController]
[Authorize]
[Route("api/v2/users")]
public class UserController(UserService userService) : ControllerBase
{
    private readonly UserService _userService = userService;

  [HttpGet("profile")]
    public async Task<IActionResult> ProfileUser()
    {
        var userId = User.FindFirst("userId")?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }
        var user = await _userService.Profile(userId);
        return Ok(new ApiResponse<ProfileResponse>("Profile retrieved succesfully", true, new ProfileResponse
        {
            Id = user.Id,
            Username = user.Username,
            Name = user.Name,
            Email = user.Email
        } ));
    }
}