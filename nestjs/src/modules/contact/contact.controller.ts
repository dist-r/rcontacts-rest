import { Controller, Post, Get, Put, Delete, Param } from "@nestjs/common";
import { ContactService } from "./contact.service";

@Controller("contacts")
export class ContactController {

  constructor(private readonly contactService: ContactService) {}
  
  @Get()
  async getAllContacts() {
    return await this.contactService.getAllContacts();
  }

  @Get(":id")
  async getContactById(@Param("id") id: string) {
    return await this.contactService.getContactById(id);
  }

  @Post()
  async createContact() {
    return await this.contactService.createContact();
  }

  @Put(":id")
  async updateContact(@Param("id") id: string) {
    return await this.contactService.updateContact(id);
  }

  @Delete(":id")
  async deleteContact(@Param("id") id: string) {
    return await this.contactService.deleteContact(id);
  }
}