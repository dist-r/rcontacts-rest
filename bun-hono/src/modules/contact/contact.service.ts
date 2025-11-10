import ContactRepository from "./contact.respository";
import Contact from "./contact";
import AppError from "../../common/api.error";
import { appLog } from "../../config/logger.pino";

class ContactService {
  
  constructor(private contactRepository: ContactRepository) {}

  async createContact(name: string, email: string, phone: string, userId: number){
    appLog.debug("Contact Service: createContact called")
    appLog.debug({name, email, phone, userId})
    try {
      const contact = await this.contactRepository.create(name, email, phone, userId)
      return contact
    } catch (error){
      throw new AppError(500, "Something error when creating contact")
    }
  }

  async findAllContact(userId: number){
    const contacts = await this.contactRepository.findAll(userId)
    if (!contacts) {
      throw new AppError(404, "Contacts not found")
    }
    return contacts
  }

  async updateContact(id: number, contact: Partial<Contact>){
    const existingContact = await this.contactRepository.findByID(id)
    if (!existingContact) {
      throw new AppError(404, "Contact not found")
    }
    const updatedContact = await this.contactRepository.update(id, contact)
    return updatedContact
  }

  async deleteContact(id: number){
    const existingContact = await this.contactRepository.findByID(id)
    if(!existingContact){
      throw new AppError(404, "Contact not found")
    }
    await this.contactRepository.delete(id)
    return true
  }
}

export default ContactService;