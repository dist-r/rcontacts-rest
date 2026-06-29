import { Controller, Post, Get, Put, Delete, Param, HttpCode, UseGuards, Body, ValidationPipe } from "@nestjs/common";
import { ContactService } from "./contact.service";
import { ApiResponse } from "src/shared/api.response";
import { AuthGuard } from "src/common/guards/auth.guard";
import { CurrentUser } from "src/common/decorators/current.user";
import { AppError } from "src/shared/app.error";
import { ReqContactDto } from "./contract/dto/contact.dto";
import { Contact } from "./contract/types/contact.type";

@Controller("contacts")
@UseGuards(AuthGuard)
export class ContactController {

  constructor(private readonly contactService: ContactService) {}
  
  @Get()
  @HttpCode(200)
  async getAllContacts(@CurrentUser() currentUser: any) {

    const userId = currentUser.id as string;
    const result = await this.contactService.getAllContacts(userId);
    const response : ApiResponse<Contact[]> = {
      success: true,
      message: "Restrify Contacts wa a successfully",
      data: result
    }
    return response;
  }

  @Get(":id")
  @HttpCode(200)
  async getContactById(@Param("id") id: string) {
    throw new AppError("Unimplmented endpoint", 400)
  }

  @Post()
  @HttpCode(201)
  async createContact(
    @CurrentUser() currentUser : any,
    @Body() createContact : ReqContactDto
  ) {
    const userId = currentUser.id as string;
    const result = await this.contactService.createContact(createContact, userId)

    const response : ApiResponse<Contact> ={
      success: true,
      message: "Create contact was a succesfully",
      data: result
    }
    return response
  }

  @Put(":id")
  @HttpCode(200)
  async updateContact(
    @Param("id") id: string,
    @CurrentUser() currentUser : any,
    @Body() payload : ReqContactDto
  ) {
    const userId = currentUser.id as string;
    console.log(userId)
    const result = await this.contactService.updateContact(id, userId, payload)
    const response : ApiResponse<Contact> = {
      success: true,
      message: "Update contact was a succesfully",
      data: result
    }
    return response
  }

  @Delete(":id")
  @HttpCode(200)
  async deleteContact(@Param("id") id: string, @CurrentUser() currentUser : any) {
    const userId = currentUser.id as string
    await this.contactService.deleteContact(id, userId )
    const response : ApiResponse<null> = {
      success: true,
      message: "Delete contact was a succesfully",
      data: null
    }
    return response
  }
}