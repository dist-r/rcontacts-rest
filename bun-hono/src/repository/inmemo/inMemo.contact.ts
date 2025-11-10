import ContactRepository from "../../modules/contact/contact.respository";
import Contact from "../../modules/contact/contact";

class InMemoryContactRepository implements ContactRepository {
  contacts: Contact[]

  constructor() {
    this.contacts = []
  }

  async create(name: string, email: string, phone: string, userId: number): Promise<Contact> {
    const contact = {
      id: this.contacts.length + 1,
      name,
      email,
      phone,
      userId
    }
    this.contacts.push(contact)
    return contact
  }

  async findByID(id: number): Promise<Contact | undefined> {
    return this.contacts.find(contact => contact.id === id)
  }

  async findAll(userId: number): Promise<Contact[] | undefined> {
    const userContacts = this.contacts.filter(contact => contact.userId === userId);
    return userContacts.length > 0 ? userContacts : undefined;
  }

  async update(id: number, contact: Partial<Contact>): Promise<Contact | undefined> {
    const index = this.contacts.findIndex(c => c.id === id)
    if (index === -1) {
      return undefined
    }
    this.contacts[index] = {
      ...this.contacts[index],
      ...contact
    }
    return this.contacts[index]
  }

  async delete(id: number): Promise<void> {
    this.contacts = this.contacts.filter(contact => contact.id !== id)
  }
}

export default InMemoryContactRepository;