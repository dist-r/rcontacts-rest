import ContactRepository from "./contact.respository";
import Contact from "./contact";
import AppError from "../../common/api.error";
import ILogger from "../../config/logger/Ilogger";

class ContactService {
  
  constructor(private contactRepository: ContactRepository, private logger: ILogger) {}

  async createContact(name: string, email: string, phone: string, userId: string): Promise<Contact> {
    
    this.logger.debug("Service Contact create Called")
    const resultContact = await this.contactRepository.create(name, email, phone, userId)
    return resultContact;
   
  }

  async findAllContact(userId: string): Promise<Contact[]>{

    this.logger.debug("Service Contact findAll Called", { userId })
    const contacts = await this.contactRepository.findAll(userId)
    return contacts

  }

  async updateContact(id: string, userId: string, contact: Partial<Contact>) : Promise<Partial<Contact>> {

    const existingContact = await this.contactRepository.findByID(id)
    if (!existingContact) {
      throw new AppError(404, "Contact not found")
    }
    if (existingContact.userId !== userId) {
      throw new AppError(403, "Forbidden")
    }
    const updatedContact = await this.contactRepository.update(id, contact)
    return updatedContact

  }

  async deleteContact(id: string, userId: string) : Promise<Partial<Contact>> {

    const existingContact = await this.contactRepository.findByID(id)
    if(!existingContact){
      throw new AppError(404, "Contact not found")
    }
    if (existingContact.userId !== userId){
      throw new AppError(403, "Forbidden")
    }
    const deletedContact = await this.contactRepository.delete(id)
    return deletedContact

  }
}

export default ContactService;