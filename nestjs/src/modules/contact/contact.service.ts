import { Inject, Injectable } from '@nestjs/common';
import type IContactRepository from './contact.repository';
import { randomUUID } from 'crypto';
import { ReqContactDto } from './contract/dto/contact.dto';
import { Contact } from './contract/types/contact.type';
import { AppError } from 'src/shared/app.error';

@Injectable()
export class ContactService {
  constructor(
    @Inject('IContactRepository')
    private readonly contactRepository: IContactRepository,
  ) {}

  async getAllContacts(userId: string): Promise<Contact[]> {
    const result = this.contactRepository.getAll(userId);
    return result;
  }

  async createContact(
    createContactDto: ReqContactDto,
    userId: string,
  ): Promise<Contact> {
    const createNew: Contact = {
      id: randomUUID(),
      userId: userId,
      name: createContactDto.name!,
      email: createContactDto.email!,
      phone: createContactDto.phone!,
    };
    const result = await this.contactRepository.create(createNew);
    return result;
  }

  async updateContact(
    id: string,
    userId: string,
    updateContactDto: ReqContactDto,
  ): Promise<Contact> {
    const existingContact = await this.contactRepository.findId(id);
    if (!existingContact) {
      throw new AppError('Contact not found', 404);
    }
    if (existingContact.userId !== userId) {
      throw new AppError('Forbidden', 403);
    }
    console.log(userId);
    const updateContact = await this.contactRepository.update(
      updateContactDto,
      id,
    );
    return updateContact;
  }

  async deleteContact(contactId: string, userId: string): Promise<void> {
    const existingContact = await this.contactRepository.findId(contactId);
    if (!existingContact) {
      throw new AppError('Contact not found', 404);
    }
    if (existingContact.userId !== userId) {
      throw new AppError('Forbidden', 403);
    }
    await this.contactRepository.delete(contactId);
  }
}
