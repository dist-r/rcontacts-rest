import {Injectable} from '@nestjs/common';

@Injectable()
export class ContactService {
  async getAllContacts() {
    return { message: "Get all contacts" };
  }

  async getContactById(id: string) {
    return { message: `Get contact with ID: ${id}` };
  }

  async createContact() {
    return { message: "Create a new contact" };
  }

  async updateContact(id: string) {
    return { message: `Update contact with ID: ${id}` };
  }

  async deleteContact(id: string) {
    return { message: `Delete contact with ID: ${id}` };
  }
}