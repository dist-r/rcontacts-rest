import AppError from "../../common/api.error";
import ContactService from "./contact.service";
import { Context } from "hono";
import ILogger from "../../config/logger/ilogger";
import { ApiResponse } from "../../common/api.response";
import { CreateContactSchema, CreateContactResponse, UpdateContactSchema, UpdateContactResponse, FindAllContactResponse } from "./contact.dto";

class ContactController {
  constructor(
    private contactService: ContactService,
    private logger: ILogger,
  ) {}

  async createContact(c: Context) {

    this.logger.debug("Controller Contact create Called")
    const {name, email, phone} = await c.req.json();
    const parseResult = CreateContactSchema.safeParse({name, email, phone});
    if (!parseResult.success) {
      throw new AppError(400, "Invalid request body");
    }
    const userId = c.get("userId");
    const result = await this.contactService.createContact(name, email, phone, userId);
    
    const response : ApiResponse<CreateContactResponse> = {
      message: "Contact created successfully",
      success: true,
      data: {
        id: result.id,
        userId: result.userId,
        name: result.name,
        email: result.email,
        phone: result.phone
      }
    }
    c.status(201)
    return c.json(response)
    
  }

  async findAllContact(c: Context) {
    
    const userId = c.get("userId")
    const contacts = await this.contactService.findAllContact(userId)
    const response : ApiResponse<FindAllContactResponse> = {
      message: "Contacts retrieved successfully",
      success: true,
      data: contacts
    }
    return c.json(response)

  }

  async updateContact(c: Context) {

    const userId = c.get("userId")
    const id = c.req.param('id')
    const {name, email, phone} = await c.req.json();
    const parseResult = UpdateContactSchema.safeParse({id, userId, name, email, phone});
  
    if (!parseResult.success){
      throw new AppError(400, "Invalid request body");
    }

    const result = await this.contactService.updateContact(id, userId, {name, email, phone});
    const response : ApiResponse<UpdateContactResponse> = {
      message: "Contact updated successfully",
      success: true,
      data: {
        id: result.id!,
        userId: result.userId!,
        name: result.name!,
        email: result.email!,
        phone: result.phone!
      }
    }
    c.status(200)
    return c.json(response);

  }

  async deleteContact(c: Context) {

    const id = c.req.param('id')
    const userId = c.get("userId")
    
    await this.contactService.deleteContact(id, userId)

    const resposne : ApiResponse<null> = {
        message: "Contact deleted successfully",
        success: true,
        data: null
      }
    c.status(200)
    return c.json(resposne)

  }
}

export default ContactController;