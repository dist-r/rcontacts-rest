namespace AspDotNet.Features.Contact;
using AspDotNet.Shared;
public class ContactService(IContactRepository contactRepository, ILogger<ContactService> logger)
{
    private readonly IContactRepository _contactRepository = contactRepository;
    private readonly ILogger<ContactService> _logger = logger;

    public async Task<Contact> CreateContact(string userId, string name, string email, string phone)
    {
        var contact = new Contact
        {
            Id = Guid.NewGuid().ToString(),
            UserId = userId,
            Name = name,
            Email = email,
            Phone = phone
        };

        var existtingEmail = await _contactRepository.GetContactById(email);
        if (existtingEmail != null)
        {
            _logger.LogInformation(null, "Email already in use");
            throw new AppException("Email already in use", 400);
        }

        var result = await _contactRepository.Create(contact);
        
        var userWithoutPassword = new Contact
        {
            Id = result.Id,
            UserId = result.UserId,
            Name = result.Name,
            Email = result.Email,
            Phone = result.Phone
        };

        return userWithoutPassword;
    }

    public async Task<List<Contact>> GetAllContacts(string userId)
    {
        var contacts = await _contactRepository.GetAllByUserId(userId);
        return contacts;
    }

    public async Task<Contact> UpdateContact(string id, string userId, string name, string email, string phone)
    {
      var contact = new Contact
      {
        Id = id,
        UserId = userId,
        Name = name,
        Email = email,
        Phone = phone
      };

      var existingContact = await _contactRepository.GetContactById(id);
    
      if (existingContact == null)
      {
        _logger.LogInformation(null, "Contact not found");
        throw new AppException("Contact not found", 404);
      }

      if (existingContact.UserId != userId)
      {
        _logger.LogInformation(null, "Unauthorized to update contact");
        throw new AppException("Unauthorized to update contact", 403);
      }

      var result = await _contactRepository.Update(contact);
      return result;

    }

    public async Task<Contact> DeleteContact(string id, string userId)
    {
      var contact = await _contactRepository.GetContactById(id);
      if (contact == null)
      {
        _logger.LogInformation(null, "Nothing contact found when user delete contact");
        throw new AppException("Nothing contact found when user delete contact", 404);
      }

      var result= await _contactRepository.Delete(id);
      return result;
    }
    
}