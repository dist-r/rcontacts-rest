import IContactRepository from "./contact.repository";
import { Contact } from "./contact";
import ILogger from "../../config/log/ilogger";
import AppError from "../../shared/custom.error";

export default class ContactService {

  constructor(
    private contactRepository: IContactRepository,
    private logger: ILogger
  ) {}

  async createContact (userId: string, name: string, email: string, telephone: string): Promise<Contact> {
    const result = await this.contactRepository.create(userId, name, email, telephone);
    this.logger.info(`Contact created for userId: ${userId} with name: ${name}`);
    return result;
  }

  async updateContact (id: string, userId: string, name: string, email: string, telephone: string): Promise<Contact> {
    const result = await this.contactRepository.update(id, name, email, telephone);
    if(userId !== result?.userId){
      this.logger.warn(`Unauthorized update attempt for contact id: ${id} by userId: ${userId}`);
      throw new AppError("Unauthorized", 403);
    }
    if(!result){
      this.logger.warn(`Contact not found with id: ${id} for userId: ${userId}`);
      throw new AppError("Contact not found", 404);
    }
    this.logger.info(`Contact updated for userId: ${userId} with name: ${name}`);
    return result;
  }

  async deleteContact (id: string, userId: string): Promise<void> {
    const result = await this.contactRepository.findById(id);
    if(userId !== result?.userId){
      this.logger.warn(`Unauthorized delete attempt for contact id: ${id} by userId: ${userId}`);
      throw new AppError("Unauthorized", 403);
    }
    await this.contactRepository.delete(id);
    this.logger.info(`Contact deleted with id: ${id}`);
  }
  
  async getAllContacts (userId: string): Promise<Contact[]> {
    const result = await this.contactRepository.findAll(userId);
    if(!result){
      this.logger.warn(`No contacts found for userId: ${userId}`);
      throw new AppError("No contacts found", 404);
    }
    this.logger.info(`Contacts retrieved for userId: ${userId}`);
    return result as Contact[];
  }
}