import ContactService from "./contact.service";
import { Request, Response } from "express";
// import ILogger from "../../config/log/ilogger";
import { CreateContactDto, UpdateContactDto, DeleteContactDto } from "./contact.dto";
import { CreateContactType, UpdateContactType, DeleteContactType } from "./contact.dto";
import {CreateContactResponseDto, UpdateContactResponseDto, DeleteContactResponseDto, GetAllContactsResponseDto} from "./contact.dto";
import ApiResponse from "../../shared/api.response";

class ContactController {

  constructor(
    private contactService: ContactService,
  ){}

  async createContact(req: Request, res: Response): Promise<void> {
    const userFromBeforeHandler = (req as any).userId as string;
    const { name, email, phone } = req.body as CreateContactDto;

    const parseResult: CreateContactDto = CreateContactType.parse({ name, email, phone });

    const result = await this.contactService.createContact(userFromBeforeHandler, parseResult.name, parseResult.email, parseResult.phone);
    const dataResponse: CreateContactResponseDto = {
      id: result.id,
      name: result.name,
      email: result.email,
      phone: result.phone,
    }

    const response : ApiResponse<CreateContactResponseDto> = {
      message: "Contact created successfully",
      data: dataResponse,
    }
    res.status(201).json(response);
  }

  async updateContact(req: Request, res: Response): Promise<void> {
    const userFromBeforeHandler = (req as any).userId as string;
    const { id } = req.params as { id: string };
    const { name, email, phone } = req.body as UpdateContactDto;

    const parseResult: UpdateContactDto = UpdateContactType.parse({ id, name, email, phone });

    const result = await this.contactService.updateContact(id, userFromBeforeHandler, parseResult.name, parseResult.email, parseResult.phone);
    const dataResponse: UpdateContactResponseDto = {
      id: result.id,
      name: result.name,
      email: result.email,
      phone: result.phone,
    }

    const response : ApiResponse<UpdateContactResponseDto> = {
      message: "Contact updated successfully",
      data: dataResponse,
    }
    res.status(200).json(response);
  }

  async deleteContact(req: Request, res: Response): Promise<void> {
    const { id } = req.params as { id: string };
    const userFromBeforeHandler = (req as any).userId as string;

    const parseResult: DeleteContactDto = DeleteContactType.parse({ id });

    await this.contactService.deleteContact(parseResult.id, userFromBeforeHandler);

    const response : ApiResponse<DeleteContactResponseDto> = {
      message: "Contact deleted successfully",
      data: { message: "Contact deleted successfully" },
    }
    res.status(200).json(response);
  }

  async getAllContacts(req: Request, res: Response): Promise<void> {
    const userFromBeforeHandler = (req as any).userId as string;

    const result = await this.contactService.getAllContacts(userFromBeforeHandler);
    let dataResponse: GetAllContactsResponseDto[] = [];
    if(!result || result.length === 0){
      dataResponse = [];
    } else {
      dataResponse = result.map(contact => ({
        id: contact.id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
      }));
    }
    
    const response: ApiResponse<GetAllContactsResponseDto[]> = {
      message: "Contacts retrieved successfully",
      data: dataResponse,
    };
    res.status(200).json(response);
  }
}

export default ContactController;