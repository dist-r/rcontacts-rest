namespace AspDotNet.Features.Contact;

public interface IContactRepository
{
    Task<Contact?> GetContactById(string id);

    Task<List<Contact>> GetAllByUserId(string userId);

    Task<Contact> Create(Contact contact);

    Task<Contact> Update(Contact contact);

    Task<Contact> Delete(string id);
}