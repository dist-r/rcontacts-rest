import { Controller, Post, Get, Put, Delete, Param, HttpCode, UseGuards } from "@nestjs/common";
import { ContactService } from "./contact.service";
import { ApiResponse } from "src/shared/api.response";
import { AuthGuard } from "src/common/guards/auth.guard";
import { CurrentUser } from "src/common/decorators/current.user";

@Controller("contacts")
@UseGuards(AuthGuard)
export class ContactController {

  constructor(private readonly contactService: ContactService) {}
  
  @Get()
  @HttpCode(200)
  async getAllContacts(@CurrentUser() currentUser: any) {

    const userId = currentUser.id as string;
    // const conatacts = await this.contactService.getAllContacts();
   
  }

  @Get(":id")
  @HttpCode(200)
  async getContactById(@Param("id") id: string) {
    return await this.contactService.getContactById(id);
  }

  @Post()
  @HttpCode(201)
  async createContact() {
    return await this.contactService.createContact();
  }

  @Put(":id")
  @HttpCode(200)
  async updateContact(@Param("id") id: string) {
    return await this.contactService.updateContact(id);
  }

  @Delete(":id")
  @HttpCode(200)
  async deleteContact(@Param("id") id: string) {
    return await this.contactService.deleteContact(id);
  }
}