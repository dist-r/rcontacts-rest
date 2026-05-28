import IContactRepository from "../../modules/contact/contact.respository"
import Contact from "../../modules/contact/contact"

class InMemoryContactRepository implements IContactRepository {
  contacts: Contact[]

  constructor() {
    this.contacts = []
  }

  async create(name: string, email: string, phone: string, userId: string): Promise<Contact> {
    const id = crypto.randomUUID()
    const contact = {
      id,
      name,
      email,
      phone,
      userId
    }
    this.contacts.push(contact)
    const result = this.contacts.find(contact => contact.id === id)
    if (!result) {
      throw new Error("Contact not found")
    }
    return result
  }

  async findByID(id: string): Promise<Contact | null> {
    const contact = this.contacts.find(contact => contact.id === id)
    if (!contact) {
      return null
    }
    return contact
  }

  async findAll(userId: string): Promise<Contact[]> {
    const userContacts = this.contacts.filter(contact => contact.userId === userId);
    return userContacts;
  }

  async update(id: string, contact: Partial<Contact>): Promise<Contact> {
    const index = this.contacts.findIndex(c => c.id === id)
    if (index === -1) {
      throw new Error("Contact not found")
    }
    this.contacts[index] = {
      ...this.contacts[index],
      ...contact
    }
    return this.contacts[index]
  }

  async delete(id: string): Promise<Contact> {
    const deletedContact = this.contacts.find(contact => contact.id === id)
    if (!deletedContact) {
      throw new Error("Contact not found")
    }
    this.contacts = this.contacts.filter(contact => contact.id !== id)
    return deletedContact
  }
}

export default InMemoryContactRepository;
