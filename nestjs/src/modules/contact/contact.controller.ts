import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  HttpCode,
  UseGuards,
  Body,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { ApiResponse } from 'src/shared/api.response';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/current.user';
import { ReqContactDto } from './contract/dto/contact.dto';
import { Contact } from './contract/types/contact.type';
import type { AccessTokenPayload } from 'src/common/utils/jwt.service';

@Controller('contacts')
@UseGuards(AuthGuard)
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  @HttpCode(200)
  async getAllContacts(@CurrentUser() currentUser: AccessTokenPayload) {
    const userId = currentUser.id;
    const result = await this.contactService.getAllContacts(userId);
    const response: ApiResponse<Contact[]> = {
      success: true,
      message: 'Retrify Contacts was a successfully',
      data: result,
    };
    return response;
  }

  // @Get(':id')
  // @HttpCode(200)
  // async getContactById(@Param('id') id: string) {
  //   console.log(id);
  //   throw new AppError('Unimplmented endpoint', 400);
  // }

  @Post()
  @HttpCode(201)
  async createContact(
    @CurrentUser() currentUser: AccessTokenPayload,
    @Body() createContact: ReqContactDto,
  ) {
    const userId = currentUser.id;
    const result = await this.contactService.createContact(
      createContact,
      userId,
    );

    const response: ApiResponse<Contact> = {
      success: true,
      message: 'Create contact was a succesfully',
      data: result,
    };
    return response;
  }

  @Put(':id')
  @HttpCode(200)
  async updateContact(
    @Param('id') id: string,
    @CurrentUser() currentUser: AccessTokenPayload,
    @Body() payload: ReqContactDto,
  ) {
    const userId = currentUser.id;
    console.log(userId);
    const result = await this.contactService.updateContact(id, userId, payload);
    const response: ApiResponse<Contact> = {
      success: true,
      message: 'Update contact was a succesfully',
      data: result,
    };
    return response;
  }

  @Delete(':id')
  @HttpCode(200)
  async deleteContact(
    @Param('id') id: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    const userId = currentUser.id;
    await this.contactService.deleteContact(id, userId);
    const response: ApiResponse<null> = {
      success: true,
      message: 'Delete contact was a succesfully',
      data: null,
    };
    return response;
  }
}
