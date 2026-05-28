namespace AspDotNet.Features.Contact;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AspDotNet.Shared;

[ApiController]
[Authorize]
[Route("api/v2/")]
public class ContactController(ContactService contactService) : ControllerBase
{
  private readonly ContactService _contactService = contactService;

  [HttpPost("contacts")]
  public async Task<IActionResult> CreateContact([FromBody] CreateContactRequest request)
  {
    var userId = User.FindFirst("userId")?.Value;
    if (string.IsNullOrEmpty(userId))
    {
      return Unauthorized();
    }

    var result = await _contactService.CreateContact(userId, request.Name, request.Email, request.Phone);
    return Created(
      $"/api/v1/contacts/{result.Id}"
      ,new ApiResponse<CreateContactResponse>("Contact create succesfully", true, new CreateContactResponse
    {
      Id = result.Id,
      UserId = result.UserId,
      Name = result.Name,
      Email = result.Email,
      Phone = result.Phone
    }));
  }

  [HttpGet("contacts")]
  public async Task<IActionResult> GetAllContacts()
  {
    var userId = User.FindFirst("userId")?.Value;
    if (string.IsNullOrEmpty(userId))
    {
      return Unauthorized();
    }

    var result = await _contactService.GetAllContacts(userId);
    return Ok(new ApiResponse<GetAllContactsResponse>("Contacts retrieved succesfully", true, new GetAllContactsResponse
    {
      Contacts = result
    }));
  }

  [HttpPut("contacts/{id}")]
  public async Task<IActionResult> UpdateContact([FromBody] UpdateContactRequest request, [FromRoute] string id)
  {
    var userId = User.FindFirst("userId")?.Value;
    if (string.IsNullOrEmpty(userId))
    {
      return Unauthorized();
    }

    var result = await _contactService.UpdateContact(id, userId, request.Name, request.Email, request.Phone);

    return Ok(new ApiResponse<UpdateContactResponse>("Update contact succesfully",true,  new UpdateContactResponse
    {
      Id = result.Id,
      UserId = result.UserId,
      Name = result.Name,
      Email = result.Email,
      Phone = result.Phone
    }));
  }

  [HttpDelete("contacts/{id}")]
  public async Task<IActionResult> DeleteContact([FromRoute] string id)
  {
    var contactId= id;
    var userId = User.FindFirst("userId")?.Value;
    if (string.IsNullOrEmpty(userId))
    {
      return Unauthorized();
    }

    await _contactService.DeleteContact(contactId, userId);

    return Ok(new ApiResponse<object?>("Delete contact succesfully",true,  null));
    
  }
}
