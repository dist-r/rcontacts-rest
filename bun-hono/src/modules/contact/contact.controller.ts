import AppError from "../../common/api.error";
import ContactService from "./contact.service";
import UserService from "../user/user.service";
import { Context } from "hono";
import Contact from "./contact";
import { appLog } from "../../config/logger.pino";

class ContactController {
  constructor(
    private contactService: ContactService,
    private userService: UserService
  ) {}

  async createContact(c: Context) {
    appLog.debug("Contact Controller: createContact called")
    const {name, email, phone} = await c.req.json()
    if (!name || !email || !phone){
      throw new AppError(400, "Missing required fields")
    }
    const userId = c.get("userId")
    appLog.debug({userId})
    const user = await this.userService.profileUser(userId)
    if (!user) {
      throw new AppError(404, "User not found")
    }
    try {
      await this.contactService.createContact(name, email, phone, userId)
      return c.json({
        "message" : "Create contact was a succesfully"
      })
    } catch (error) {
      throw error
    }
  }

  async findAllContact(c: Context) {
    const userId = c.get("userId")
    try {
      const contacts = await this.contactService.findAllContact(userId)
      return c.json(contacts)
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async updateContact(c: Context) {
    const id = c.req.param('id')
    const {name, email, phone} = await c.req.json()
    if (!name || !email || !phone){
      throw new AppError(400, "Missing required fields")
    } 
    const contact : Partial<Contact> = {
      name,
      email,
      phone
    }

    try {
      const updatedContact = await this.contactService.updateContact(id, contact)
      return c.json(updatedContact)
    } catch (error) {
      throw error
    }
  }

  async deleteContact(c: Context) {
    const id = c.req.param('id')
    try {
      await this.contactService.deleteContact(id)
      c.status(200)
      return c.json({message: "Contact deleted successfully"})
    } catch (error) {
      throw error
    }
  }
}

export default ContactController;